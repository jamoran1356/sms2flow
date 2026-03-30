// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title  SMS2FlowMachineRegistry
 * @author SMS2Flow Team
 * @notice On-chain registry for vending/service machines and their products.
 *         Settlement and RWA layer for the SMS2Flow Machines feature on BNB Smart Chain.
 *
 * @dev Architecture:
 *   - SMS (access layer)  → user sends an SMS command to the backend
 *   - Backend (logic)     → validates, resolves machine/product, calls purchaseProduct
 *   - BSC (settlement)    → this contract records the payment and emits ProductPurchased
 *   - Backend listens     → calls the physical machine's IoT webhook, then confirmDispense
 *   - Optional bridge     → future interoperability with Flow or other ecosystems
 *
 *   Uses AccessControl with DEFAULT_ADMIN_ROLE and OPERATOR_ROLE.
 *   Uses ReentrancyGuard on all payable/refund/withdraw paths.
 *   Counters start at 1 — ID == 0 is reserved to detect "does not exist".
 */
contract SMS2FlowMachineRegistry is AccessControl, ReentrancyGuard {

    // ─────────────────────────────────────────────────────────────────────────
    // Roles
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Operator role — can register machines, add products, confirm dispense.
    ///         Assign this to the backend hot-wallet.
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // ─────────────────────────────────────────────────────────────────────────
    // Custom Errors
    // ─────────────────────────────────────────────────────────────────────────

    error MachineNotFound(uint256 machineId);
    error MachineNotActive(uint256 machineId);
    error MachineCodeAlreadyExists(string machineCode);
    error ProductNotFound(uint256 productId);
    error ProductNotActive(uint256 productId);
    error ProductNotInMachine(uint256 productId, uint256 machineId);
    error InsufficientStock(uint256 productId);
    error IncorrectPayment(uint256 expected, uint256 received);
    error PurchaseNotFound(uint256 purchaseId);
    error AlreadyDispensed(uint256 purchaseId);
    error AlreadyRefunded(uint256 purchaseId);
    error InsufficientMachineRevenue(uint256 machineId, uint256 available, uint256 requested);
    error NotOwnerOrAdmin(address caller, uint256 machineId);
    error TransferFailed();
    error ZeroAddress();

    // ─────────────────────────────────────────────────────────────────────────
    // Data Structures
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Represents a physical vending or service machine.
    struct Machine {
        uint256 machineId;
        address owner;          // receives revenue withdrawals
        string  machineCode;    // unique public identifier, e.g. "BOG-MCH-001"
        string  location;       // human-readable location
        bool    active;
        uint256 totalRevenue;   // cumulative wei received (decremented on refund/withdrawal)
    }

    /// @notice Represents a product available in a machine.
    struct Product {
        uint256 productId;
        uint256 machineId;
        string  sku;            // stock-keeping unit code
        string  name;           // display name
        uint256 priceWei;       // price in wei (BNB)
        uint256 stock;          // units remaining
        bool    active;
    }

    /// @notice Represents a single purchase transaction.
    struct Purchase {
        uint256 purchaseId;
        uint256 machineId;
        uint256 productId;
        address buyer;
        uint256 amountPaid;     // wei paid
        string  smsReference;   // original SMS command reference for audit/correlation
        bool    dispensed;
        bool    refunded;
        uint256 createdAt;      // block.timestamp at purchase time
    }

    // ─────────────────────────────────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────────────────────────────────

    uint256 private _machineCounter;
    uint256 private _productCounter;
    uint256 private _purchaseCounter;

    /// @dev machineId => Machine
    mapping(uint256 => Machine)  private _machines;
    /// @dev productId => Product
    mapping(uint256 => Product)  private _products;
    /// @dev purchaseId => Purchase
    mapping(uint256 => Purchase) private _purchases;

    /// @dev machineCode => machineId  (used to enforce uniqueness of machine codes)
    mapping(string => uint256) private _machineCodeToId;

    /// @dev machineId => ordered list of productIds for that machine
    mapping(uint256 => uint256[]) private _machineProducts;

    /// @dev machineId => withdrawable ETH/BNB balance (in wei)
    ///      Decremented on refund and withdrawal; incremented on purchase.
    mapping(uint256 => uint256) private _machineBalances;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice A new machine was registered.
    event MachineRegistered(
        uint256 indexed machineId,
        address indexed owner,
        string  machineCode,
        string  location
    );

    /// @notice A machine was activated or deactivated.
    event MachineStatusUpdated(uint256 indexed machineId, bool active);

    /// @notice A new product was added to a machine.
    event ProductAdded(
        uint256 indexed productId,
        uint256 indexed machineId,
        string  sku,
        string  name,
        uint256 priceWei,
        uint256 stock
    );

    /// @notice A product's price, stock, or active flag was updated.
    event ProductUpdated(
        uint256 indexed productId,
        uint256 priceWei,
        uint256 stock,
        bool    active
    );

    /**
     * @notice A product was purchased.
     * @dev    The backend listens for this event to trigger the physical
     *         machine's dispensing mechanism (IoT webhook / serial command).
     *         After the machine confirms dispensing, the backend calls
     *         confirmDispense(purchaseId).
     */
    event ProductPurchased(
        uint256 indexed purchaseId,
        uint256 indexed machineId,
        uint256 indexed productId,
        address buyer,
        uint256 amountPaid,
        string  smsReference
    );

    /// @notice The backend confirmed that the machine dispensed the product.
    event DispenseConfirmed(uint256 indexed purchaseId, address confirmedBy);

    /// @notice A purchase was refunded to the buyer.
    event PurchaseRefunded(
        uint256 indexed purchaseId,
        address indexed buyer,
        uint256 amount
    );

    /// @notice Revenue was withdrawn from a machine's balance.
    event RevenueWithdrawn(
        uint256 indexed machineId,
        address indexed to,
        uint256 amount
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @param adminAddress    Address granted DEFAULT_ADMIN_ROLE (multisig recommended).
     * @param operatorAddress Address granted OPERATOR_ROLE (backend hot-wallet).
     */
    constructor(address adminAddress, address operatorAddress) {
        if (adminAddress    == address(0)) revert ZeroAddress();
        if (operatorAddress == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, adminAddress);
        _grantRole(OPERATOR_ROLE,      operatorAddress);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Machine Management
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Register a new physical machine.
     * @param  machineCode   Unique human-readable identifier (e.g. "BOG-MCH-001").
     * @param  location      Human-readable location string.
     * @param  machineOwner  Address of the machine owner (receives revenue withdrawals).
     * @return machineId     Auto-incremented ID assigned to this machine.
     */
    function registerMachine(
        string  calldata machineCode,
        string  calldata location,
        address          machineOwner
    ) external onlyRole(OPERATOR_ROLE) returns (uint256 machineId) {
        if (machineOwner == address(0)) revert ZeroAddress();
        if (_machineCodeToId[machineCode] != 0) revert MachineCodeAlreadyExists(machineCode);

        unchecked { _machineCounter++; }
        machineId = _machineCounter;

        _machines[machineId] = Machine({
            machineId:    machineId,
            owner:        machineOwner,
            machineCode:  machineCode,
            location:     location,
            active:       true,
            totalRevenue: 0
        });

        _machineCodeToId[machineCode] = machineId;

        emit MachineRegistered(machineId, machineOwner, machineCode, location);
    }

    /**
     * @notice Activate or deactivate a machine.
     * @param  machineId  Target machine ID.
     * @param  active     New status.
     */
    function updateMachineStatus(uint256 machineId, bool active)
        external
        onlyRole(OPERATOR_ROLE)
    {
        _requireMachineExists(machineId);
        _machines[machineId].active = active;
        emit MachineStatusUpdated(machineId, active);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Product Management
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Add a product to a machine.
     * @param  machineId  Target machine.
     * @param  sku        Stock-keeping unit code.
     * @param  name       Display name.
     * @param  priceWei   Price in wei (BNB).
     * @param  stock      Initial quantity available.
     * @return productId  Auto-incremented ID assigned to this product.
     */
    function addProduct(
        uint256         machineId,
        string calldata sku,
        string calldata name,
        uint256         priceWei,
        uint256         stock
    ) external onlyRole(OPERATOR_ROLE) returns (uint256 productId) {
        _requireMachineExists(machineId);

        unchecked { _productCounter++; }
        productId = _productCounter;

        _products[productId] = Product({
            productId: productId,
            machineId: machineId,
            sku:       sku,
            name:      name,
            priceWei:  priceWei,
            stock:     stock,
            active:    true
        });

        _machineProducts[machineId].push(productId);

        emit ProductAdded(productId, machineId, sku, name, priceWei, stock);
    }

    /**
     * @notice Update a product's price, stock, and active flag.
     * @param  productId  Target product.
     * @param  priceWei   New price in wei.
     * @param  stock      New stock quantity.
     * @param  active     New active flag.
     */
    function updateProduct(
        uint256 productId,
        uint256 priceWei,
        uint256 stock,
        bool    active
    ) external onlyRole(OPERATOR_ROLE) {
        _requireProductExists(productId);

        Product storage p = _products[productId];
        p.priceWei = priceWei;
        p.stock    = stock;
        p.active   = active;

        emit ProductUpdated(productId, priceWei, stock, active);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Purchase
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Purchase a product from a machine.
     *         The caller must send exactly `product.priceWei` as msg.value.
     *
     * @param  machineId     Target machine.
     * @param  productId     Target product.
     * @param  smsReference  Original SMS command string for backend correlation and audit.
     * @return purchaseId    Auto-incremented purchase ID.
     *
     * @dev   Emits `ProductPurchased`. The backend listens for this event to
     *        send a dispensing command to the physical machine's IoT controller.
     *        After the machine acknowledges, the backend calls confirmDispense().
     */
    function purchaseProduct(
        uint256         machineId,
        uint256         productId,
        string calldata smsReference
    ) external payable nonReentrant returns (uint256 purchaseId) {
        _requireMachineExists(machineId);

        Machine storage m = _machines[machineId];
        if (!m.active) revert MachineNotActive(machineId);

        _requireProductExists(productId);

        Product storage p = _products[productId];
        if (!p.active)             revert ProductNotActive(productId);
        if (p.machineId != machineId) revert ProductNotInMachine(productId, machineId);
        if (p.stock == 0)          revert InsufficientStock(productId);
        if (msg.value != p.priceWei) revert IncorrectPayment(p.priceWei, msg.value);

        // ── Effects ────────────────────────────────────────────────────────
        unchecked {
            p.stock--;
            m.totalRevenue          += msg.value;
            _machineBalances[machineId] += msg.value;
            _purchaseCounter++;
        }
        purchaseId = _purchaseCounter;

        _purchases[purchaseId] = Purchase({
            purchaseId:   purchaseId,
            machineId:    machineId,
            productId:    productId,
            buyer:        msg.sender,
            amountPaid:   msg.value,
            smsReference: smsReference,
            dispensed:    false,
            refunded:     false,
            createdAt:    block.timestamp
        });

        emit ProductPurchased(purchaseId, machineId, productId, msg.sender, msg.value, smsReference);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Dispense & Refund
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Mark a purchase as dispensed.  Called by the backend after the
     *         physical machine confirms it delivered the product.
     * @param  purchaseId  Target purchase.
     */
    function confirmDispense(uint256 purchaseId)
        external
        onlyRole(OPERATOR_ROLE)
    {
        _requirePurchaseExists(purchaseId);

        Purchase storage pur = _purchases[purchaseId];
        if (pur.dispensed) revert AlreadyDispensed(purchaseId);
        if (pur.refunded)  revert AlreadyRefunded(purchaseId);

        pur.dispensed = true;
        emit DispenseConfirmed(purchaseId, msg.sender);
    }

    /**
     * @notice Refund a purchase to the original buyer.
     *         Only callable if the purchase has not yet been dispensed or refunded.
     * @param  purchaseId  Target purchase.
     */
    function refundPurchase(uint256 purchaseId)
        external
        nonReentrant
        onlyRole(OPERATOR_ROLE)
    {
        _requirePurchaseExists(purchaseId);

        Purchase storage pur = _purchases[purchaseId];
        if (pur.dispensed) revert AlreadyDispensed(purchaseId);
        if (pur.refunded)  revert AlreadyRefunded(purchaseId);

        uint256 amount    = pur.amountPaid;
        address buyer     = pur.buyer;
        uint256 mId       = pur.machineId;

        // ── Effects before interaction (Checks-Effects-Interactions) ───────
        pur.refunded = true;
        _machines[mId].totalRevenue    -= amount;
        _machineBalances[mId]          -= amount;

        // ── Interaction ────────────────────────────────────────────────────
        (bool ok, ) = payable(buyer).call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit PurchaseRefunded(purchaseId, buyer, amount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Revenue Withdrawal
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Withdraw accumulated revenue for a machine.
     * @param  machineId  Target machine.
     * @param  to         Recipient address (payable).
     * @param  amount     Amount in wei to withdraw.
     *
     * @dev   Only the machine owner or an address with DEFAULT_ADMIN_ROLE may call this.
     */
    function withdrawMachineRevenue(
        uint256         machineId,
        address payable to,
        uint256         amount
    ) external nonReentrant {
        _requireMachineExists(machineId);
        if (to == address(0)) revert ZeroAddress();

        bool isAdmin = hasRole(DEFAULT_ADMIN_ROLE, msg.sender);
        bool isOwner = (_machines[machineId].owner == msg.sender);
        if (!isAdmin && !isOwner) revert NotOwnerOrAdmin(msg.sender, machineId);

        uint256 available = _machineBalances[machineId];
        if (amount > available) revert InsufficientMachineRevenue(machineId, available, amount);

        // ── Effects ────────────────────────────────────────────────────────
        _machineBalances[machineId]        -= amount;
        _machines[machineId].totalRevenue  -= amount;

        // ── Interaction ────────────────────────────────────────────────────
        (bool ok, ) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit RevenueWithdrawn(machineId, to, amount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // View Functions
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Returns full machine data.
    function getMachine(uint256 machineId) external view returns (Machine memory) {
        _requireMachineExists(machineId);
        return _machines[machineId];
    }

    /// @notice Returns full product data.
    function getProduct(uint256 productId) external view returns (Product memory) {
        _requireProductExists(productId);
        return _products[productId];
    }

    /// @notice Returns full purchase data.
    function getPurchase(uint256 purchaseId) external view returns (Purchase memory) {
        _requirePurchaseExists(purchaseId);
        return _purchases[purchaseId];
    }

    /**
     * @notice Returns all product IDs registered under a machine.
     * @dev    For machines with many products, prefer off-chain indexing via
     *         the `ProductAdded(machineId)` event to avoid gas-heavy loops.
     */
    function getProductsByMachine(uint256 machineId)
        external
        view
        returns (uint256[] memory)
    {
        _requireMachineExists(machineId);
        return _machineProducts[machineId];
    }

    /// @notice Returns the current withdrawable balance (in wei) for a machine.
    function getMachineRevenue(uint256 machineId) external view returns (uint256) {
        _requireMachineExists(machineId);
        return _machineBalances[machineId];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal Helpers
    // ─────────────────────────────────────────────────────────────────────────

    function _requireMachineExists(uint256 machineId) internal view {
        if (_machines[machineId].machineId == 0) revert MachineNotFound(machineId);
    }

    function _requireProductExists(uint256 productId) internal view {
        if (_products[productId].productId == 0) revert ProductNotFound(productId);
    }

    function _requirePurchaseExists(uint256 purchaseId) internal view {
        if (_purchases[purchaseId].purchaseId == 0) revert PurchaseNotFound(purchaseId);
    }
}
