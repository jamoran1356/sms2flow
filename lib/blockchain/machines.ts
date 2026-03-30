/**
 * lib/blockchain/machines.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Integration helper for SMS2FlowMachineRegistry on BNB Smart Chain.
 *
 * Architecture layer:
 *   SMS (access) → Backend Next.js (orchestration) → BSC via this helper (settlement)
 *
 * Supports two usage modes:
 *   1. Read-only  – pass a Provider  (no wallet needed, for views/getters)
 *   2. Read-write – pass a Signer    (wallet required, for state-changing calls)
 *
 * Usage (read-only, e.g. from a Next.js API route):
 *   import { MachineRegistryService } from "@/lib/blockchain/machines";
 *   import { ethers } from "ethers";
 *
 *   const provider = new ethers.JsonRpcProvider(process.env.BSC_TESTNET_RPC);
 *   const svc = MachineRegistryService.fromProvider(provider, process.env.MACHINE_REGISTRY_ADDRESS!);
 *   const machine = await svc.getMachine(1n);
 *
 * Usage (write, e.g. from a backend API route with the operator wallet):
 *   const provider = new ethers.JsonRpcProvider(process.env.BSC_TESTNET_RPC);
 *   const signer  = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
 *   const svc = MachineRegistryService.fromSigner(signer, process.env.MACHINE_REGISTRY_ADDRESS!);
 *   const tx = await svc.confirmDispense(purchaseId);
 *   await tx.wait();
 *
 * Note on TypeChain:
 *   After running `npx hardhat compile` the toolchain generates typed wrappers
 *   under `typechain-types/`.  You can replace the manual ABI array below and
 *   the `ethers.Contract` call with the generated factory for full type safety:
 *
 *   import { SMS2FlowMachineRegistry__factory } from "@/typechain-types";
 *   const contract = SMS2FlowMachineRegistry__factory.connect(address, signerOrProvider);
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  ethers,
  type Provider,
  type Signer,
  type ContractTransactionResponse,
  type BigNumberish,
} from "ethers";

// ── Minimal ABI ──────────────────────────────────────────────────────────────
// Kept as a string array so this file compiles without Hardhat artifacts.
// Replace with the TypeChain import comment above once you run `hardhat compile`.
const REGISTRY_ABI = [
  // ── Machine management ─────────────────────────────────────────────────
  "function registerMachine(string machineCode, string location, address machineOwner) returns (uint256)",
  "function updateMachineStatus(uint256 machineId, bool active)",

  // ── Product management ─────────────────────────────────────────────────
  "function addProduct(uint256 machineId, string sku, string name, uint256 priceWei, uint256 stock) returns (uint256)",
  "function updateProduct(uint256 productId, uint256 priceWei, uint256 stock, bool active)",

  // ── Purchase ───────────────────────────────────────────────────────────
  "function purchaseProduct(uint256 machineId, uint256 productId, string smsReference) payable returns (uint256)",

  // ── Dispense & refund ──────────────────────────────────────────────────
  "function confirmDispense(uint256 purchaseId)",
  "function refundPurchase(uint256 purchaseId)",

  // ── Revenue ────────────────────────────────────────────────────────────
  "function withdrawMachineRevenue(uint256 machineId, address to, uint256 amount)",

  // ── Views ──────────────────────────────────────────────────────────────
  "function getMachine(uint256 machineId) view returns (tuple(uint256 machineId, address owner, string machineCode, string location, bool active, uint256 totalRevenue))",
  "function getProduct(uint256 productId) view returns (tuple(uint256 productId, uint256 machineId, string sku, string name, uint256 priceWei, uint256 stock, bool active))",
  "function getPurchase(uint256 purchaseId) view returns (tuple(uint256 purchaseId, uint256 machineId, uint256 productId, address buyer, uint256 amountPaid, string smsReference, bool dispensed, bool refunded, uint256 createdAt))",
  "function getProductsByMachine(uint256 machineId) view returns (uint256[])",
  "function getMachineRevenue(uint256 machineId) view returns (uint256)",

  // ── Events ─────────────────────────────────────────────────────────────
  "event MachineRegistered(uint256 indexed machineId, address indexed owner, string machineCode, string location)",
  "event MachineStatusUpdated(uint256 indexed machineId, bool active)",
  "event ProductAdded(uint256 indexed productId, uint256 indexed machineId, string sku, string name, uint256 priceWei, uint256 stock)",
  "event ProductUpdated(uint256 indexed productId, uint256 priceWei, uint256 stock, bool active)",
  "event ProductPurchased(uint256 indexed purchaseId, uint256 indexed machineId, uint256 indexed productId, address buyer, uint256 amountPaid, string smsReference)",
  "event DispenseConfirmed(uint256 indexed purchaseId, address confirmedBy)",
  "event PurchaseRefunded(uint256 indexed purchaseId, address indexed buyer, uint256 amount)",
  "event RevenueWithdrawn(uint256 indexed machineId, address indexed to, uint256 amount)",
] as const;

// ── Domain types ─────────────────────────────────────────────────────────────

export interface MachineData {
  machineId:    bigint;
  owner:        string;
  machineCode:  string;
  location:     string;
  active:       boolean;
  totalRevenue: bigint;
}

export interface ProductData {
  productId: bigint;
  machineId: bigint;
  sku:       string;
  name:      string;
  priceWei:  bigint;
  stock:     bigint;
  active:    boolean;
}

export interface PurchaseData {
  purchaseId:   bigint;
  machineId:    bigint;
  productId:    bigint;
  buyer:        string;
  amountPaid:   bigint;
  smsReference: string;
  dispensed:    boolean;
  refunded:     boolean;
  createdAt:    bigint;
}

// ── Service ──────────────────────────────────────────────────────────────────

/**
 * MachineRegistryService
 *
 * Thin wrapper around the SMS2FlowMachineRegistry ethers.Contract instance.
 * All write methods return the raw ContractTransactionResponse so the caller
 * can choose when (and whether) to await `.wait()`.
 */
export class MachineRegistryService {
  private readonly _contract: ethers.Contract;

  private constructor(signerOrProvider: Signer | Provider, address: string) {
    this._contract = new ethers.Contract(address, REGISTRY_ABI, signerOrProvider);
  }

  /** Create a read-only service instance (no wallet required). */
  static fromProvider(provider: Provider, address: string): MachineRegistryService {
    return new MachineRegistryService(provider, address);
  }

  /** Create a read-write service instance (wallet / Signer required). */
  static fromSigner(signer: Signer, address: string): MachineRegistryService {
    return new MachineRegistryService(signer, address);
  }

  // ── Machine ────────────────────────────────────────────────────────────────

  /**
   * Register a new vending machine.  Requires OPERATOR_ROLE on the contract.
   * @param machineCode  Unique human-readable code, e.g. "BOG-MCH-001".
   * @param location     Free-text location string.
   * @param machineOwner Ethereum address of the machine owner.
   */
  async registerMachine(
    machineCode:  string,
    location:     string,
    machineOwner: string,
  ): Promise<ContractTransactionResponse> {
    return this._contract.registerMachine(machineCode, location, machineOwner);
  }

  /**
   * Activate or deactivate a machine.  Requires OPERATOR_ROLE.
   */
  async updateMachineStatus(
    machineId: BigNumberish,
    active:    boolean,
  ): Promise<ContractTransactionResponse> {
    return this._contract.updateMachineStatus(machineId, active);
  }

  // ── Product ────────────────────────────────────────────────────────────────

  /**
   * Add a product to an existing machine.  Requires OPERATOR_ROLE.
   * @param priceWei Price in wei (use ethers.parseEther / parseUnits).
   */
  async addProduct(
    machineId: BigNumberish,
    sku:       string,
    name:      string,
    priceWei:  BigNumberish,
    stock:     BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return this._contract.addProduct(machineId, sku, name, priceWei, stock);
  }

  /**
   * Update product price, stock, and active flag.  Requires OPERATOR_ROLE.
   */
  async updateProduct(
    productId: BigNumberish,
    priceWei:  BigNumberish,
    stock:     BigNumberish,
    active:    boolean,
  ): Promise<ContractTransactionResponse> {
    return this._contract.updateProduct(productId, priceWei, stock, active);
  }

  // ── Purchase ───────────────────────────────────────────────────────────────

  /**
   * Purchase a product.  The caller must send exactly `priceWei` as the
   * transaction value.  The emitted `ProductPurchased` event triggers the
   * backend listener which commands the physical machine to dispense.
   *
   * @param smsReference  Original SMS command string for audit trail.
   * @param priceWei      Must match `product.priceWei` exactly.
   */
  async purchaseProduct(
    machineId:    BigNumberish,
    productId:    BigNumberish,
    smsReference: string,
    priceWei:     BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return this._contract.purchaseProduct(machineId, productId, smsReference, {
      value: priceWei,
    });
  }

  // ── Dispense & Refund ──────────────────────────────────────────────────────

  /**
   * Confirm the machine dispensed the product.  Requires OPERATOR_ROLE.
   * Called by the backend after the physical machine's IoT controller
   * acknowledges the dispense command.
   */
  async confirmDispense(purchaseId: BigNumberish): Promise<ContractTransactionResponse> {
    return this._contract.confirmDispense(purchaseId);
  }

  /**
   * Refund a purchase that was not dispensed.  Requires OPERATOR_ROLE.
   */
  async refundPurchase(purchaseId: BigNumberish): Promise<ContractTransactionResponse> {
    return this._contract.refundPurchase(purchaseId);
  }

  // ── Revenue ────────────────────────────────────────────────────────────────

  /**
   * Withdraw BNB revenue from a machine's balance.
   * Only the machine owner or an address with DEFAULT_ADMIN_ROLE may call this.
   */
  async withdrawMachineRevenue(
    machineId: BigNumberish,
    to:        string,
    amount:    BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return this._contract.withdrawMachineRevenue(machineId, to, amount);
  }

  // ── Views ──────────────────────────────────────────────────────────────────

  /** Fetch full machine data by ID. Throws if not found. */
  async getMachine(machineId: BigNumberish): Promise<MachineData> {
    const raw = await this._contract.getMachine(machineId);
    return {
      machineId:    raw.machineId,
      owner:        raw.owner,
      machineCode:  raw.machineCode,
      location:     raw.location,
      active:       raw.active,
      totalRevenue: raw.totalRevenue,
    };
  }

  /** Fetch full product data by ID. Throws if not found. */
  async getProduct(productId: BigNumberish): Promise<ProductData> {
    const raw = await this._contract.getProduct(productId);
    return {
      productId: raw.productId,
      machineId: raw.machineId,
      sku:       raw.sku,
      name:      raw.name,
      priceWei:  raw.priceWei,
      stock:     raw.stock,
      active:    raw.active,
    };
  }

  /** Fetch full purchase data by ID. Throws if not found. */
  async getPurchase(purchaseId: BigNumberish): Promise<PurchaseData> {
    const raw = await this._contract.getPurchase(purchaseId);
    return {
      purchaseId:   raw.purchaseId,
      machineId:    raw.machineId,
      productId:    raw.productId,
      buyer:        raw.buyer,
      amountPaid:   raw.amountPaid,
      smsReference: raw.smsReference,
      dispensed:    raw.dispensed,
      refunded:     raw.refunded,
      createdAt:    raw.createdAt,
    };
  }

  /**
   * Return all product IDs registered under a machine.
   * For high-volume machines, prefer event-based off-chain indexing.
   */
  async getProductsByMachine(machineId: BigNumberish): Promise<bigint[]> {
    return this._contract.getProductsByMachine(machineId);
  }

  /** Return the current withdrawable BNB balance (wei) for a machine. */
  async getMachineRevenue(machineId: BigNumberish): Promise<bigint> {
    return this._contract.getMachineRevenue(machineId);
  }

  // ── Direct contract access ────────────────────────────────────────────────

  /**
   * Returns the raw ethers.Contract instance for advanced use cases such as
   * setting up persistent event subscriptions.
   *
   * @example
   *   const c = svc.raw();
   *   c.on("ProductPurchased", (purchaseId, machineId, productId, buyer, amount, ref) => {
   *     // handle event
   *   });
   */
  raw(): ethers.Contract {
    return this._contract;
  }
}
