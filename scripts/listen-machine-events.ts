/**
 * scripts/listen-machine-events.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Persistent backend listener for SMS2FlowMachineRegistry events on BSC.
 *
 * Architecture:
 *   On-chain event  ──►  this process  ──►  HTTP POST (IoT webhook)
 *                                       ──►  backend API calls confirmDispense()
 *
 * Run:
 *   TS_NODE_PROJECT=tsconfig.hardhat.json npx ts-node scripts/listen-machine-events.ts
 *
 * Required env vars in .env.machines:
 *   BSC_TESTNET_RPC              — JSON-RPC endpoint
 *   MACHINE_REGISTRY_ADDRESS     — deployed contract address
 *
 * Optional env vars:
 *   MACHINE_IOT_WEBHOOK_URL      — full HTTPS URL of the IoT controller endpoint
 *   MACHINE_IOT_WEBHOOK_SECRET   — bearer token for the IoT webhook
 *   BSC_MAINNET_RPC              — switch to mainnet by setting this and the RPC_URL override
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { ethers }  from "ethers";
import * as https  from "https";
import * as http   from "http";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.machines" });

// ── Config ───────────────────────────────────────────────────────────────────

const RPC_URL          = process.env.BSC_TESTNET_RPC ?? "https://data-seed-prebsc-1-s1.binance.org:8545";
const CONTRACT_ADDRESS = process.env.MACHINE_REGISTRY_ADDRESS;
const IOT_WEBHOOK_URL  = process.env.MACHINE_IOT_WEBHOOK_URL;        // optional
const IOT_WEBHOOK_SECRET = process.env.MACHINE_IOT_WEBHOOK_SECRET ?? ""; // optional

if (!CONTRACT_ADDRESS) {
  console.error("❌  MACHINE_REGISTRY_ADDRESS is not set in .env.machines");
  process.exit(1);
}

// ── ABI — only the event signatures we consume ───────────────────────────────

const ABI = [
  "event ProductPurchased(uint256 indexed purchaseId, uint256 indexed machineId, uint256 indexed productId, address buyer, uint256 amountPaid, string smsReference)",
  "event DispenseConfirmed(uint256 indexed purchaseId, address confirmedBy)",
  "event PurchaseRefunded(uint256 indexed purchaseId, address indexed buyer, uint256 amount)",
  "event MachineRegistered(uint256 indexed machineId, address indexed owner, string machineCode, string location)",
  "event MachineStatusUpdated(uint256 indexed machineId, bool active)",
  "event ProductAdded(uint256 indexed productId, uint256 indexed machineId, string sku, string name, uint256 priceWei, uint256 stock)",
];

// ── Provider & contract ──────────────────────────────────────────────────────

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// ── IoT webhook helper ────────────────────────────────────────────────────────

interface DispensePayload {
  purchaseId:   string;
  machineId:    string;
  productId:    string;
  buyer:        string;
  amountPaid:   string;  // wei as string
  smsReference: string;
}

/**
 * POST a JSON payload to the physical machine's IoT controller webhook.
 *
 * In production this endpoint would be served by an edge device (Raspberry Pi,
 * industrial PLC, cloud IoT hub, etc.).  After the machine dispenses the product
 * it should call back into the Next.js API at `/api/machines/dispense-callback`
 * which in turn calls `confirmDispense(purchaseId)` on-chain.
 *
 * Security note: always use HTTPS and validate the secret / HMAC on the
 * receiving side.  Do NOT expose the IoT endpoint on a public IP without auth.
 */
function triggerMachineDispense(payload: DispensePayload): void {
  if (!IOT_WEBHOOK_URL) {
    // No webhook configured — log stub so the developer can wire it up.
    console.log("  [IoT stub]  Would POST dispense command:", payload);
    console.log("  [IoT stub]  Set MACHINE_IOT_WEBHOOK_URL in .env.machines to enable.");
    return;
  }

  const body    = JSON.stringify(payload);
  const parsed  = new URL(IOT_WEBHOOK_URL);
  const useHttps = parsed.protocol === "https:";
  const mod     = useHttps ? https : http;

  const options = {
    hostname: parsed.hostname,
    port:     parsed.port || (useHttps ? 443 : 80),
    path:     parsed.pathname + parsed.search,
    method:   "POST",
    headers:  {
      "Content-Type":   "application/json",
      "Content-Length": Buffer.byteLength(body),
      ...(IOT_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${IOT_WEBHOOK_SECRET}` }
        : {}),
    },
  };

  const req = (mod as typeof https).request(options, (res) => {
    console.log(`  [IoT webhook]  HTTP ${res.statusCode} for purchaseId=${payload.purchaseId}`);
  });

  req.on("error", (err: Error) => {
    console.error(`  [IoT webhook]  Error for purchaseId=${payload.purchaseId}:`, err.message);
  });

  req.write(body);
  req.end();
}

// ── Event: ProductPurchased ──────────────────────────────────────────────────

contract.on(
  "ProductPurchased",
  (
    purchaseId:   bigint,
    machineId:    bigint,
    productId:    bigint,
    buyer:        string,
    amountPaid:   bigint,
    smsReference: string,
    event:        ethers.EventLog,
  ) => {
    const divider = "─".repeat(60);
    console.log(`\n${divider}`);
    console.log("  EVENT: ProductPurchased");
    console.log(`${divider}`);
    console.log(`  purchaseId   : ${purchaseId}`);
    console.log(`  machineId    : ${machineId}`);
    console.log(`  productId    : ${productId}`);
    console.log(`  buyer        : ${buyer}`);
    console.log(`  amountPaid   : ${ethers.formatEther(amountPaid)} BNB`);
    console.log(`  smsReference : ${smsReference}`);
    console.log(`  txHash       : ${event.transactionHash}`);
    console.log(`  blockNumber  : ${event.blockNumber}`);
    console.log(`${divider}\n`);

    // ── ▼ Machine trigger point ───────────────────────────────────────────
    // Send the dispense command to the physical machine's IoT controller.
    // After the machine confirms dispensing, your callback handler should call:
    //
    //   POST /api/machines/dispense-callback  { purchaseId }
    //   → which calls contract.confirmDispense(purchaseId) on-chain
    //
    triggerMachineDispense({
      purchaseId:   purchaseId.toString(),
      machineId:    machineId.toString(),
      productId:    productId.toString(),
      buyer,
      amountPaid:   amountPaid.toString(),
      smsReference,
    });
  },
);

// ── Event: DispenseConfirmed ─────────────────────────────────────────────────

contract.on(
  "DispenseConfirmed",
  (purchaseId: bigint, confirmedBy: string, event: ethers.EventLog) => {
    console.log(
      `[DispenseConfirmed] purchaseId=${purchaseId}  confirmedBy=${confirmedBy}  tx=${event.transactionHash}`,
    );
  },
);

// ── Event: PurchaseRefunded ──────────────────────────────────────────────────

contract.on(
  "PurchaseRefunded",
  (purchaseId: bigint, buyer: string, amount: bigint, event: ethers.EventLog) => {
    console.log(
      `[PurchaseRefunded]  purchaseId=${purchaseId}  buyer=${buyer}  amount=${ethers.formatEther(amount)} BNB  tx=${event.transactionHash}`,
    );
  },
);

// ── Event: MachineRegistered ─────────────────────────────────────────────────

contract.on(
  "MachineRegistered",
  (machineId: bigint, owner: string, machineCode: string, location: string, event: ethers.EventLog) => {
    console.log(
      `[MachineRegistered] id=${machineId}  code=${machineCode}  location=${location}  owner=${owner}  tx=${event.transactionHash}`,
    );
  },
);

// ── Event: MachineStatusUpdated ──────────────────────────────────────────────

contract.on(
  "MachineStatusUpdated",
  (machineId: bigint, active: boolean, event: ethers.EventLog) => {
    console.log(
      `[MachineStatusUpdated] machineId=${machineId}  active=${active}  tx=${event.transactionHash}`,
    );
  },
);

// ── Event: ProductAdded ──────────────────────────────────────────────────────

contract.on(
  "ProductAdded",
  (
    productId: bigint,
    machineId: bigint,
    sku:       string,
    name:      string,
    priceWei:  bigint,
    stock:     bigint,
    event:     ethers.EventLog,
  ) => {
    console.log(
      `[ProductAdded] productId=${productId}  machineId=${machineId}  sku=${sku}  name="${name}"  price=${ethers.formatEther(priceWei)} BNB  stock=${stock}  tx=${event.transactionHash}`,
    );
  },
);

// ── Error handling ───────────────────────────────────────────────────────────

provider.on("error", (err: Error) => {
  console.error("[Provider error]", err.message);
});

// ── Startup banner ───────────────────────────────────────────────────────────

async function start(): Promise<void> {
  const block = await provider.getBlockNumber();

  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║   SMS2Flow Machines — Event Listener                ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log(`  RPC      : ${RPC_URL}`);
  console.log(`  Contract : ${CONTRACT_ADDRESS}`);
  console.log(`  Block    : ${block}`);
  console.log(`  Webhook  : ${IOT_WEBHOOK_URL ?? "(not configured — using stub)"}`);
  console.log("\n  Listening for events…  (Ctrl+C to stop)\n");
}

start().catch((err: Error) => {
  console.error("Startup error:", err.message);
  process.exit(1);
});
