import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load BSC-specific environment variables from .env.machines
// (keeps BSC secrets separate from the main Next.js .env)
dotenv.config({ path: ".env.machines" });

const BSC_TESTNET_RPC  = process.env.BSC_TESTNET_RPC  ?? "https://data-seed-prebsc-1-s1.binance.org:8545";
const BSC_MAINNET_RPC  = process.env.BSC_MAINNET_RPC  ?? "https://bsc-dataseed1.binance.org";
const DEPLOYER_KEY     = process.env.DEPLOYER_PRIVATE_KEY ?? "";
const BSCSCAN_API_KEY  = process.env.BSCSCAN_API_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: false,
    },
  },

  networks: {
    // Local Hardhat in-process network (used for tests by default)
    hardhat: {},

    // BSC Testnet (Chain ID 97) — use for staging & smoke tests
    bscTestnet: {
      url:      BSC_TESTNET_RPC,
      chainId:  97,
      accounts: DEPLOYER_KEY ? [DEPLOYER_KEY] : [],
    },

    // BSC Mainnet (Chain ID 56) — production
    bscMainnet: {
      url:      BSC_MAINNET_RPC,
      chainId:  56,
      accounts: DEPLOYER_KEY ? [DEPLOYER_KEY] : [],
    },
  },

  // BSCScan contract verification
  etherscan: {
    apiKey: {
      bscTestnet: BSCSCAN_API_KEY,
      bsc:        BSCSCAN_API_KEY,
    },
    customChains: [
      {
        network: "bscTestnet",
        chainId: 97,
        urls: {
          apiURL:     "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com",
        },
      },
    ],
  },

  // TypeChain — generates ethers-v6 typed wrappers under typechain-types/
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  paths: {
    sources:   "./contracts",
    tests:     "./test",
    cache:     "./cache-hardhat",
    artifacts: "./artifacts",
  },
};

export default config;
