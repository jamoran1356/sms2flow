/**
 * scripts/deploy-machine-registry.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Hardhat deployment script for SMS2FlowMachineRegistry on BNB Smart Chain.
 *
 * Usage:
 *   # BSC Testnet
 *   TS_NODE_PROJECT=tsconfig.hardhat.json npx hardhat run scripts/deploy-machine-registry.ts --network bscTestnet
 *
 *   # BSC Mainnet
 *   TS_NODE_PROJECT=tsconfig.hardhat.json npx hardhat run scripts/deploy-machine-registry.ts --network bscMainnet
 *
 *   # Local (for quick checks)
 *   TS_NODE_PROJECT=tsconfig.hardhat.json npx hardhat run scripts/deploy-machine-registry.ts --network hardhat
 *
 * Environment variables (in .env.machines):
 *   DEPLOYER_PRIVATE_KEY      — private key of the deployer account
 *   MACHINE_ADMIN_ADDRESS     — address to receive DEFAULT_ADMIN_ROLE (defaults to deployer)
 *   MACHINE_OPERATOR_ADDRESS  — address to receive OPERATOR_ROLE (defaults to deployer)
 *   BSCSCAN_API_KEY           — required for automatic BSCScan verification
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { ethers, network, run } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.machines" });

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  console.log("\n══════════════════════════════════════════════════════");
  console.log("  SMS2Flow Machines — Contract Deployment");
  console.log("══════════════════════════════════════════════════════");
  console.log(`  Network  : ${network.name}`);
  console.log(`  Deployer : ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`  Balance  : ${ethers.formatEther(balance)} BNB\n`);

  // ── Role addresses ────────────────────────────────────────────────────────
  // adminAddress    → holds DEFAULT_ADMIN_ROLE (use a multisig in production)
  // operatorAddress → holds OPERATOR_ROLE     (backend hot-wallet)
  const adminAddress    = process.env.MACHINE_ADMIN_ADDRESS    ?? deployer.address;
  const operatorAddress = process.env.MACHINE_OPERATOR_ADDRESS ?? deployer.address;

  console.log(`  Admin    : ${adminAddress}`);
  console.log(`  Operator : ${operatorAddress}\n`);

  if (adminAddress === operatorAddress) {
    console.warn(
      "  ⚠️  Warning: admin and operator are the same address. " +
      "For production, use a separate multisig as admin.\n"
    );
  }

  // ── Deploy ────────────────────────────────────────────────────────────────
  console.log("  Deploying SMS2FlowMachineRegistry…");
  const Factory  = await ethers.getContractFactory("SMS2FlowMachineRegistry");
  const registry = await Factory.deploy(adminAddress, operatorAddress);
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  const deployTx        = registry.deploymentTransaction();

  console.log(`\n  ✅ Deployed at : ${contractAddress}`);
  if (deployTx) {
    console.log(`  Tx hash       : ${deployTx.hash}`);
    console.log(`  Gas used      : (check explorer)`);
  }

  // ── Post-deploy output block ──────────────────────────────────────────────
  console.log("\n  ─── Add to .env.machines ──────────────────────────");
  console.log(`  MACHINE_REGISTRY_ADDRESS="${contractAddress}"`);
  console.log("  ───────────────────────────────────────────────────\n");

  // ── BSCScan verification (skipped on local network) ──────────────────────
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("  Waiting 5 confirmations before verifying on BSCScan…");
    if (deployTx) await deployTx.wait(5);

    try {
      await run("verify:verify", {
        address:              contractAddress,
        constructorArguments: [adminAddress, operatorAddress],
      });
      console.log("  ✅ Contract verified on BSCScan");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("already verified")) {
        console.log("  Contract was already verified.");
      } else {
        console.warn("  ⚠️  Verification failed:", msg);
        console.warn("  Run manually:");
        console.warn(
          `  TS_NODE_PROJECT=tsconfig.hardhat.json npx hardhat verify --network ${network.name} ${contractAddress} "${adminAddress}" "${operatorAddress}"`
        );
      }
    }
  } else {
    console.log("  (Skipping BSCScan verification on local network)");
  }

  console.log("\n══════════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
