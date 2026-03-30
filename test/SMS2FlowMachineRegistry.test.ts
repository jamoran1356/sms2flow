/**
 * test/SMS2FlowMachineRegistry.test.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Hardhat / Chai tests for SMS2FlowMachineRegistry.
 *
 * Run:
 *   TS_NODE_PROJECT=tsconfig.hardhat.json npx hardhat test
 * ─────────────────────────────────────────────────────────────────────────────
 */

/// <reference path="../typechain-types/hardhat.d.ts" />

import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect }      from "chai";
import { ethers }      from "hardhat";

// ── Fixtures ─────────────────────────────────────────────────────────────────

/** Deploy a fresh registry, nothing else. */
async function deployFixture() {
  const [owner, operator, machineOwner, buyer, other] = await ethers.getSigners();

  const Factory  = await ethers.getContractFactory("SMS2FlowMachineRegistry");
  const registry = await Factory.deploy(owner.address, operator.address);
  await registry.waitForDeployment();

  return { registry, owner, operator, machineOwner, buyer, other };
}

/** Deploy + register one machine. machineId == 1 */
async function machineFixture() {
  const base = await deployFixture();
  const { registry, operator, machineOwner } = base;

  await registry
    .connect(operator)
    .registerMachine("BOG-MCH-001", "Bogotá Centro", machineOwner.address);

  return { ...base, machineId: 1n };
}

/** Deploy + machine + one product (priceWei = 0.01 BNB, stock = 10). productId == 1 */
async function productFixture() {
  const base       = await machineFixture();
  const { registry, operator, machineId } = base;
  const priceWei   = ethers.parseEther("0.01");

  await registry
    .connect(operator)
    .addProduct(machineId, "SKU-AGUA-500", "Agua 500ml", priceWei, 10n);

  return { ...base, productId: 1n, priceWei };
}

/** Deploy + machine + product + one purchase. purchaseId == 1 */
async function purchasedFixture() {
  const base = await productFixture();
  const { registry, buyer, machineId, productId, priceWei } = base;

  await registry
    .connect(buyer)
    .purchaseProduct(machineId, productId, "SMS-REF-001", { value: priceWei });

  return { ...base, purchaseId: 1n };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("SMS2FlowMachineRegistry", function () {

  // ── Deployment ──────────────────────────────────────────────────────────
  describe("Deployment", function () {
    it("grants DEFAULT_ADMIN_ROLE to the admin address", async function () {
      const { registry, owner } = await loadFixture(deployFixture);
      const ADMIN = await registry.DEFAULT_ADMIN_ROLE();
      expect(await registry.hasRole(ADMIN, owner.address)).to.be.true;
    });

    it("grants OPERATOR_ROLE to the operator address", async function () {
      const { registry, operator } = await loadFixture(deployFixture);
      const OP = await registry.OPERATOR_ROLE();
      expect(await registry.hasRole(OP, operator.address)).to.be.true;
    });

    it("reverts when adminAddress is zero", async function () {
      const [, op] = await ethers.getSigners();
      const Factory = await ethers.getContractFactory("SMS2FlowMachineRegistry");

      // Deploy a valid instance only to provide the custom error ABI to chai matcher.
      const validInstance = await Factory.deploy(op.address, op.address);
      await validInstance.waitForDeployment();

      await expect(
        Factory.deploy(ethers.ZeroAddress, op.address)
      ).to.be.revertedWithCustomError(validInstance, "ZeroAddress");
    });
  });

  // ── registerMachine ──────────────────────────────────────────────────────
  describe("registerMachine", function () {
    it("registers a machine and emits MachineRegistered", async function () {
      const { registry, operator, machineOwner } = await loadFixture(deployFixture);

      await expect(
        registry
          .connect(operator)
          .registerMachine("BOG-MCH-001", "Centro", machineOwner.address)
      )
        .to.emit(registry, "MachineRegistered")
        .withArgs(1n, machineOwner.address, "BOG-MCH-001", "Centro");
    });

    it("stores machine data correctly", async function () {
      const { registry, machineId, machineOwner } = await loadFixture(machineFixture);
      const m = await registry.getMachine(machineId);

      expect(m.machineId).to.equal(machineId);
      expect(m.owner).to.equal(machineOwner.address);
      expect(m.machineCode).to.equal("BOG-MCH-001");
      expect(m.location).to.equal("Bogotá Centro");
      expect(m.active).to.be.true;
      expect(m.totalRevenue).to.equal(0n);
    });

    it("reverts on duplicate machineCode", async function () {
      const { registry, operator, machineOwner } = await loadFixture(deployFixture);
      await registry.connect(operator).registerMachine("DUP-001", "Loc A", machineOwner.address);
      await expect(
        registry.connect(operator).registerMachine("DUP-001", "Loc B", machineOwner.address)
      ).to.be.revertedWithCustomError(registry, "MachineCodeAlreadyExists");
    });

    it("reverts when called by a non-operator", async function () {
      const { registry, other, machineOwner } = await loadFixture(deployFixture);
      await expect(
        registry.connect(other).registerMachine("X-001", "Loc", machineOwner.address)
      ).to.be.reverted;
    });

    it("reverts when machineOwner is zero address", async function () {
      const { registry, operator } = await loadFixture(deployFixture);
      await expect(
        registry.connect(operator).registerMachine("Z-001", "Loc", ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(registry, "ZeroAddress");
    });

    it("auto-increments machineId across multiple registrations", async function () {
      const { registry, operator, machineOwner } = await loadFixture(deployFixture);
      await registry.connect(operator).registerMachine("MCH-001", "A", machineOwner.address);
      await registry.connect(operator).registerMachine("MCH-002", "B", machineOwner.address);
      const m1 = await registry.getMachine(1n);
      const m2 = await registry.getMachine(2n);
      expect(m1.machineCode).to.equal("MCH-001");
      expect(m2.machineCode).to.equal("MCH-002");
    });
  });

  // ── updateMachineStatus ──────────────────────────────────────────────────
  describe("updateMachineStatus", function () {
    it("deactivates a machine and emits MachineStatusUpdated", async function () {
      const { registry, operator, machineId } = await loadFixture(machineFixture);
      await expect(registry.connect(operator).updateMachineStatus(machineId, false))
        .to.emit(registry, "MachineStatusUpdated")
        .withArgs(machineId, false);

      expect((await registry.getMachine(machineId)).active).to.be.false;
    });

    it("reactivates a machine", async function () {
      const { registry, operator, machineId } = await loadFixture(machineFixture);
      await registry.connect(operator).updateMachineStatus(machineId, false);
      await registry.connect(operator).updateMachineStatus(machineId, true);
      expect((await registry.getMachine(machineId)).active).to.be.true;
    });

    it("reverts for non-existent machine", async function () {
      const { registry, operator } = await loadFixture(deployFixture);
      await expect(
        registry.connect(operator).updateMachineStatus(999n, false)
      ).to.be.revertedWithCustomError(registry, "MachineNotFound");
    });

    it("reverts for non-operator", async function () {
      const { registry, other, machineId } = await loadFixture(machineFixture);
      await expect(
        registry.connect(other).updateMachineStatus(machineId, false)
      ).to.be.reverted;
    });
  });

  // ── addProduct ───────────────────────────────────────────────────────────
  describe("addProduct", function () {
    it("adds a product and emits ProductAdded", async function () {
      const { registry, operator, machineId } = await loadFixture(machineFixture);
      const price = ethers.parseEther("0.05");

      await expect(
        registry.connect(operator).addProduct(machineId, "SKU-01", "Café", price, 20n)
      )
        .to.emit(registry, "ProductAdded")
        .withArgs(1n, machineId, "SKU-01", "Café", price, 20n);
    });

    it("stores product data correctly", async function () {
      const { registry, productId, machineId, priceWei } = await loadFixture(productFixture);
      const p = await registry.getProduct(productId);

      expect(p.productId).to.equal(productId);
      expect(p.machineId).to.equal(machineId);
      expect(p.sku).to.equal("SKU-AGUA-500");
      expect(p.priceWei).to.equal(priceWei);
      expect(p.stock).to.equal(10n);
      expect(p.active).to.be.true;
    });

    it("reverts for non-existent machine", async function () {
      const { registry, operator } = await loadFixture(deployFixture);
      await expect(
        registry.connect(operator).addProduct(99n, "SKU-01", "X", 100n, 5n)
      ).to.be.revertedWithCustomError(registry, "MachineNotFound");
    });

    it("reverts for non-operator", async function () {
      const { registry, other, machineId } = await loadFixture(machineFixture);
      await expect(
        registry.connect(other).addProduct(machineId, "S", "N", 100n, 1n)
      ).to.be.reverted;
    });
  });

  // ── updateProduct ────────────────────────────────────────────────────────
  describe("updateProduct", function () {
    it("updates fields and emits ProductUpdated", async function () {
      const { registry, operator, productId } = await loadFixture(productFixture);
      const newPrice = ethers.parseEther("0.02");

      await expect(
        registry.connect(operator).updateProduct(productId, newPrice, 5n, false)
      )
        .to.emit(registry, "ProductUpdated")
        .withArgs(productId, newPrice, 5n, false);

      const p = await registry.getProduct(productId);
      expect(p.priceWei).to.equal(newPrice);
      expect(p.stock).to.equal(5n);
      expect(p.active).to.be.false;
    });

    it("reverts for non-existent product", async function () {
      const { registry, operator } = await loadFixture(deployFixture);
      await expect(
        registry.connect(operator).updateProduct(999n, 1n, 1n, true)
      ).to.be.revertedWithCustomError(registry, "ProductNotFound");
    });
  });

  // ── purchaseProduct ──────────────────────────────────────────────────────
  describe("purchaseProduct", function () {
    it("creates a purchase and emits ProductPurchased", async function () {
      const { registry, buyer, machineId, productId, priceWei } = await loadFixture(productFixture);

      await expect(
        registry
          .connect(buyer)
          .purchaseProduct(machineId, productId, "SMS-REF-001", { value: priceWei })
      )
        .to.emit(registry, "ProductPurchased")
        .withArgs(1n, machineId, productId, buyer.address, priceWei, "SMS-REF-001");
    });

    it("decrements product stock by 1", async function () {
      const { registry, buyer, machineId, productId, priceWei } = await loadFixture(productFixture);
      await registry
        .connect(buyer)
        .purchaseProduct(machineId, productId, "REF", { value: priceWei });
      expect((await registry.getProduct(productId)).stock).to.equal(9n);
    });

    it("increments machine balance and totalRevenue", async function () {
      const { registry, buyer, machineId, productId, priceWei } = await loadFixture(productFixture);
      await registry
        .connect(buyer)
        .purchaseProduct(machineId, productId, "REF", { value: priceWei });

      const revenue = await registry.getMachineRevenue(machineId);
      expect(revenue).to.equal(priceWei);
      expect((await registry.getMachine(machineId)).totalRevenue).to.equal(priceWei);
    });

    it("stores purchase record correctly", async function () {
      const { registry, buyer, machineId, productId, priceWei, purchaseId } =
        await loadFixture(purchasedFixture);

      const pur = await registry.getPurchase(purchaseId);
      expect(pur.machineId).to.equal(machineId);
      expect(pur.productId).to.equal(productId);
      expect(pur.buyer).to.equal(buyer.address);
      expect(pur.amountPaid).to.equal(priceWei);
      expect(pur.smsReference).to.equal("SMS-REF-001");
      expect(pur.dispensed).to.be.false;
      expect(pur.refunded).to.be.false;
    });

    it("reverts on incorrect payment (under-payment)", async function () {
      const { registry, buyer, machineId, productId, priceWei } = await loadFixture(productFixture);
      await expect(
        registry
          .connect(buyer)
          .purchaseProduct(machineId, productId, "REF", { value: priceWei - 1n })
      ).to.be.revertedWithCustomError(registry, "IncorrectPayment");
    });

    it("reverts on incorrect payment (over-payment)", async function () {
      const { registry, buyer, machineId, productId, priceWei } = await loadFixture(productFixture);
      await expect(
        registry
          .connect(buyer)
          .purchaseProduct(machineId, productId, "REF", { value: priceWei + 1n })
      ).to.be.revertedWithCustomError(registry, "IncorrectPayment");
    });

    it("reverts when machine is inactive", async function () {
      const { registry, operator, buyer, machineId, productId, priceWei } =
        await loadFixture(productFixture);
      await registry.connect(operator).updateMachineStatus(machineId, false);

      await expect(
        registry
          .connect(buyer)
          .purchaseProduct(machineId, productId, "REF", { value: priceWei })
      ).to.be.revertedWithCustomError(registry, "MachineNotActive");
    });

    it("reverts when product is inactive", async function () {
      const { registry, operator, buyer, machineId, productId, priceWei } =
        await loadFixture(productFixture);
      await registry.connect(operator).updateProduct(productId, priceWei, 10n, false);

      await expect(
        registry
          .connect(buyer)
          .purchaseProduct(machineId, productId, "REF", { value: priceWei })
      ).to.be.revertedWithCustomError(registry, "ProductNotActive");
    });

    it("reverts when out of stock", async function () {
      const { registry, operator, buyer, machineId } = await loadFixture(machineFixture);
      const price = ethers.parseEther("0.01");
      await registry.connect(operator).addProduct(machineId, "SKU-LTD", "Limited", price, 1n);
      const pid = 1n;

      // buy the only unit
      await registry.connect(buyer).purchaseProduct(machineId, pid, "FIRST", { value: price });
      // second attempt must fail
      await expect(
        registry.connect(buyer).purchaseProduct(machineId, pid, "SECOND", { value: price })
      ).to.be.revertedWithCustomError(registry, "InsufficientStock");
    });

    it("reverts when productId belongs to a different machine", async function () {
      const { registry, operator, buyer, machineOwner } = await loadFixture(deployFixture);
      const price = ethers.parseEther("0.01");

      // Register two distinct machines
      await registry.connect(operator).registerMachine("MCH-A", "Loc A", machineOwner.address);
      await registry.connect(operator).registerMachine("MCH-B", "Loc B", machineOwner.address);

      // Product belongs to machine 1
      await registry.connect(operator).addProduct(1n, "SKU-A", "Product A", price, 5n);
      const productId = 1n;

      // Attempt to purchase through machine 2
      await expect(
        registry.connect(buyer).purchaseProduct(2n, productId, "REF", { value: price })
      ).to.be.revertedWithCustomError(registry, "ProductNotInMachine");
    });
  });

  // ── confirmDispense ──────────────────────────────────────────────────────
  describe("confirmDispense", function () {
    it("marks purchase as dispensed and emits DispenseConfirmed", async function () {
      const { registry, operator, purchaseId } = await loadFixture(purchasedFixture);

      await expect(registry.connect(operator).confirmDispense(purchaseId))
        .to.emit(registry, "DispenseConfirmed")
        .withArgs(purchaseId, operator.address);

      expect((await registry.getPurchase(purchaseId)).dispensed).to.be.true;
    });

    it("reverts on double dispense", async function () {
      const { registry, operator, purchaseId } = await loadFixture(purchasedFixture);
      await registry.connect(operator).confirmDispense(purchaseId);
      await expect(
        registry.connect(operator).confirmDispense(purchaseId)
      ).to.be.revertedWithCustomError(registry, "AlreadyDispensed");
    });

    it("reverts if purchase was already refunded", async function () {
      const { registry, operator, purchaseId } = await loadFixture(purchasedFixture);
      await registry.connect(operator).refundPurchase(purchaseId);
      await expect(
        registry.connect(operator).confirmDispense(purchaseId)
      ).to.be.revertedWithCustomError(registry, "AlreadyRefunded");
    });

    it("reverts for non-operator", async function () {
      const { registry, other, purchaseId } = await loadFixture(purchasedFixture);
      await expect(
        registry.connect(other).confirmDispense(purchaseId)
      ).to.be.reverted;
    });

    it("reverts for non-existent purchase", async function () {
      const { registry, operator } = await loadFixture(deployFixture);
      await expect(
        registry.connect(operator).confirmDispense(999n)
      ).to.be.revertedWithCustomError(registry, "PurchaseNotFound");
    });
  });

  // ── refundPurchase ───────────────────────────────────────────────────────
  describe("refundPurchase", function () {
    it("refunds buyer and emits PurchaseRefunded", async function () {
      const { registry, operator, buyer, purchaseId, priceWei } =
        await loadFixture(purchasedFixture);

      const before = await ethers.provider.getBalance(buyer.address);

      await expect(registry.connect(operator).refundPurchase(purchaseId))
        .to.emit(registry, "PurchaseRefunded")
        .withArgs(purchaseId, buyer.address, priceWei);

      const after = await ethers.provider.getBalance(buyer.address);
      expect(after).to.be.gt(before);
    });

    it("decrements machine balance and totalRevenue", async function () {
      const { registry, operator, machineId, purchaseId } =
        await loadFixture(purchasedFixture);

      await registry.connect(operator).refundPurchase(purchaseId);

      expect(await registry.getMachineRevenue(machineId)).to.equal(0n);
      expect((await registry.getMachine(machineId)).totalRevenue).to.equal(0n);
    });

    it("marks purchase as refunded", async function () {
      const { registry, operator, purchaseId } = await loadFixture(purchasedFixture);
      await registry.connect(operator).refundPurchase(purchaseId);
      expect((await registry.getPurchase(purchaseId)).refunded).to.be.true;
    });

    it("reverts if already dispensed", async function () {
      const { registry, operator, purchaseId } = await loadFixture(purchasedFixture);
      await registry.connect(operator).confirmDispense(purchaseId);
      await expect(
        registry.connect(operator).refundPurchase(purchaseId)
      ).to.be.revertedWithCustomError(registry, "AlreadyDispensed");
    });

    it("reverts on double refund", async function () {
      const { registry, operator, purchaseId } = await loadFixture(purchasedFixture);
      await registry.connect(operator).refundPurchase(purchaseId);
      await expect(
        registry.connect(operator).refundPurchase(purchaseId)
      ).to.be.revertedWithCustomError(registry, "AlreadyRefunded");
    });

    it("reverts for non-operator", async function () {
      const { registry, other, purchaseId } = await loadFixture(purchasedFixture);
      await expect(registry.connect(other).refundPurchase(purchaseId)).to.be.reverted;
    });
  });

  // ── withdrawMachineRevenue ───────────────────────────────────────────────
  describe("withdrawMachineRevenue", function () {
    it("allows machine owner to withdraw and emits RevenueWithdrawn", async function () {
      const { registry, machineOwner, machineId, priceWei } =
        await loadFixture(purchasedFixture);

      const before = await ethers.provider.getBalance(machineOwner.address);
      await expect(
        registry
          .connect(machineOwner)
          .withdrawMachineRevenue(machineId, machineOwner.address, priceWei)
      )
        .to.emit(registry, "RevenueWithdrawn")
        .withArgs(machineId, machineOwner.address, priceWei);

      const after = await ethers.provider.getBalance(machineOwner.address);
      expect(after).to.be.gt(before);
    });

    it("allows admin to withdraw to any address", async function () {
      const { registry, owner, other, machineId, priceWei } =
        await loadFixture(purchasedFixture);

      await expect(
        registry.connect(owner).withdrawMachineRevenue(machineId, other.address, priceWei)
      ).to.emit(registry, "RevenueWithdrawn");
    });

    it("decrements machine balance after withdrawal", async function () {
      const { registry, machineOwner, machineId, priceWei } =
        await loadFixture(purchasedFixture);

      await registry
        .connect(machineOwner)
        .withdrawMachineRevenue(machineId, machineOwner.address, priceWei);

      expect(await registry.getMachineRevenue(machineId)).to.equal(0n);
    });

    it("reverts for non-owner non-admin", async function () {
      const { registry, other, machineId, priceWei } = await loadFixture(purchasedFixture);
      await expect(
        registry.connect(other).withdrawMachineRevenue(machineId, other.address, priceWei)
      ).to.be.revertedWithCustomError(registry, "NotOwnerOrAdmin");
    });

    it("reverts on over-withdrawal", async function () {
      const { registry, machineOwner, machineId, priceWei } =
        await loadFixture(purchasedFixture);
      const excess = priceWei + ethers.parseEther("1");
      await expect(
        registry
          .connect(machineOwner)
          .withdrawMachineRevenue(machineId, machineOwner.address, excess)
      ).to.be.revertedWithCustomError(registry, "InsufficientMachineRevenue");
    });

    it("reverts when recipient is zero address", async function () {
      const { registry, machineOwner, machineId, priceWei } =
        await loadFixture(purchasedFixture);
      await expect(
        registry
          .connect(machineOwner)
          .withdrawMachineRevenue(machineId, ethers.ZeroAddress, priceWei)
      ).to.be.revertedWithCustomError(registry, "ZeroAddress");
    });
  });

  // ── View helpers ─────────────────────────────────────────────────────────
  describe("getProductsByMachine", function () {
    it("returns all product IDs for a machine", async function () {
      const { registry, operator, machineId } = await loadFixture(machineFixture);

      await registry.connect(operator).addProduct(machineId, "A", "Product A", 100n, 5n);
      await registry.connect(operator).addProduct(machineId, "B", "Product B", 200n, 5n);
      await registry.connect(operator).addProduct(machineId, "C", "Product C", 300n, 5n);

      const ids = await registry.getProductsByMachine(machineId);
      expect(ids.length).to.equal(3);
      expect(ids[0]).to.equal(1n);
      expect(ids[1]).to.equal(2n);
      expect(ids[2]).to.equal(3n);
    });

    it("returns empty array for a machine with no products", async function () {
      const { registry, machineId } = await loadFixture(machineFixture);
      const ids = await registry.getProductsByMachine(machineId);
      expect(ids.length).to.equal(0);
    });

    it("reverts for non-existent machine", async function () {
      const { registry } = await loadFixture(deployFixture);
      await expect(registry.getProductsByMachine(999n)).to.be.revertedWithCustomError(
        registry,
        "MachineNotFound"
      );
    });
  });

  describe("getMachineRevenue", function () {
    it("returns 0 for a fresh machine", async function () {
      const { registry, machineId } = await loadFixture(machineFixture);
      expect(await registry.getMachineRevenue(machineId)).to.equal(0n);
    });

    it("accumulates revenue across multiple purchases", async function () {
      const { registry, operator, buyer, machineId } = await loadFixture(machineFixture);
      const price = ethers.parseEther("0.01");

      await registry.connect(operator).addProduct(machineId, "SKU-1", "Prod 1", price, 5n);
      const pid = 1n;

      await registry.connect(buyer).purchaseProduct(machineId, pid, "R1", { value: price });
      await registry.connect(buyer).purchaseProduct(machineId, pid, "R2", { value: price });

      expect(await registry.getMachineRevenue(machineId)).to.equal(price * 2n);
    });
  });
});
