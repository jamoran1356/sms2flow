# sms2flow

Bring crypto to everyone, one text at a time.

sms2flow is a Web3 payments platform built on Flow that allows users to interact with digital assets using SMS commands, a web dashboard, and custodial virtual wallets connected to real smart contracts on Flow Testnet.

The project is designed for accessibility-first financial infrastructure: users can register, receive a wallet, hold balance, send value to another user by phone number, interact with staking, and operate a P2P marketplace flow without requiring a browser wallet for every transaction.

## Why sms2flow

Most crypto products assume that users have:

- a smartphone
- stable internet access
- wallet literacy
- direct access to modern banking rails

sms2flow is built for a different reality.

It connects the Flow blockchain with familiar channels such as SMS and lightweight web interfaces so users can:

- create a Flow-ready account
- hold value in virtual wallets
- transfer value using phone numbers
- interact with staking flows
- prepare P2P liquidity and payout workflows
- operate from environments with limited connectivity

## Current Product Scope

The platform currently includes:

- public landing page with product narrative and P2P marketplace section
- user dashboard for wallet, SMS payments, staking, transactions and settings
- admin area for monitoring users, transactions, wallets, staking and system operations
- registration flow that provisions a user wallet and associates contract metadata
- SMS transaction ingestion endpoint
- Flow Testnet smart contracts for virtual wallets, staking, P2P marketplace and DeFi vault functionality

## What Is Real Today

This repository is not only a UI prototype.

The project already includes real Flow Testnet integration for:

- deployed Cadence contracts
- Flow CLI project configuration
- signed backend transactions using an admin account
- on-chain virtual wallet provisioning for users
- on-chain staking transactions
- on-chain P2P offer creation, fill and cancel flows
- on-chain DeFi vault deposit and withdrawal flows

## Tech Stack

- Next.js 16.2.1
- React 19
- Prisma + PostgreSQL
- NextAuth
- Tailwind CSS + Radix UI
- Flow FCL / Flow SDK
- Cadence smart contracts on Flow Testnet
- PNPM

## Architecture Overview

### Application Layer

- `app/` contains the App Router pages, dashboards and API routes
- `components/` contains UI and shared components
- `lib/` contains auth, Flow helpers and on-chain execution utilities
- `prisma/` contains the database schema and seed data

### Blockchain Layer

- `flow/contracts/` contains the Cadence contracts
- `flow/transactions/` contains transaction templates
- `flow.json` defines the Flow project, accounts and deployments

### Data Layer

Prisma models cover:

- users and roles
- wallets
- transactions
- SMS messages
- staking pools and positions
- contract metadata
- network configuration
- audit logs

## Smart Contracts

The following contracts are included and deployed to Flow Testnet:

### 1. SMS2FlowVirtualWallet

Purpose:

- create virtual wallets per user
- track internal balances
- transfer value between users by wallet identifier

File:

- `flow/contracts/SMS2FlowVirtualWallet.cdc`

### 2. SMS2FlowStaking

Purpose:

- record staked balances
- accrue rewards
- allow unstaking flows

File:

- `flow/contracts/SMS2FlowStaking.cdc`

### 3. SMS2FlowP2PMarketplace

Purpose:

- create liquidity offers
- fill offers
- cancel offers

File:

- `flow/contracts/SMS2FlowP2PMarketplace.cdc`

### 4. SMS2FlowDeFiVault

Purpose:

- manage internal deposit balances
- support withdrawals
- enable internal balance transfers

File:

- `flow/contracts/SMS2FlowDeFiVault.cdc`

## Flow Testnet Deployment

The repository is already configured as a Flow project.

Contracts are declared in:

- `flow.json`

Default Testnet deployer account currently used in local development:

- account name: `sms2flow`
- contract address: `0xbcc2b6820b8f616d`

That account currently hosts:

- `SMS2FlowVirtualWallet`
- `SMS2FlowStaking`
- `SMS2FlowP2PMarketplace`
- `SMS2FlowDeFiVault`

## Main Business Flows

### User Registration

When a user registers:

- a platform user is created in PostgreSQL
- a wallet record is created
- contract records are associated with that wallet
- if admin signing is configured, the user is also provisioned on-chain in the virtual wallet contract

### SMS Transfer Flow

Example command:

```text
SEND 5 FLOW TO +5734567890
```

The system will:

- parse the SMS command
- identify the sender by phone number
- identify the recipient by phone number
- resolve both virtual wallet identifiers
- execute a signed Flow transaction when admin credentials are configured
- persist the transaction and audit metadata in PostgreSQL

### Staking Flow

The staking API can:

- read user staking balances from Flow Testnet
- execute staking transactions on-chain
- persist staking positions in the application database

### P2P Marketplace Flow

The P2P marketplace API can:

- create offers on-chain
- fill offers on-chain
- cancel offers on-chain

This is designed to support the broader product idea of automated bank payout routing and AI-assisted quote selection.

### DeFi Vault Flow

The DeFi API can:

- read vault balances from the contract
- deposit on-chain
- withdraw on-chain

## API Surface

Key routes include:

- `/api/register`
- `/api/transactions`
- `/api/wallets`
- `/api/sms`
- `/api/staking`
- `/api/p2p-marketplace`
- `/api/defi`
- `/api/contracts`
- `/api/admin/flow-provision`


## Flow CLI Usage

If you want to redeploy contracts to testnet:

```bash
flow project deploy --network testnet
```

If you want to create and fund a new testnet account:

```bash
flow accounts create --network testnet
flow accounts fund <account-name> --network testnet
```

## Testing And Validation

### 1) Flow Contract Smoke Test (read-only)

Validates chain connectivity and contract availability without moving funds.

```bash
pnpm test:flow:smoke
```

Required env vars:

- `FLOW_COMMAND_TRANSFER_CONTRACT_ADDRESS`
- `FLOW_VIRTUAL_WALLET_CONTRACT_ADDRESS`

Optional env vars:

- `FLOW_ACCESS_NODE` (default `https://rest-testnet.onflow.org`)
- `FLOW_NETWORK` (default `testnet`)

### 2) Flow Contract End-to-End Confirmation Test (write mode)

Executes the full secure flow on-chain:

- request transfer with confirmation key
- confirm transfer with key
- validate status changed to confirmed
- validate wallet balances moved only after confirmation

```bash
pnpm test:flow:e2e
```

Additional required env vars:

- `FLOW_ADMIN_ADDRESS`
- `FLOW_ADMIN_PRIVATE_KEY`
- `FLOW_ADMIN_KEY_ID`
- `FLOW_TEST_FROM_WALLET_ID`
- `FLOW_TEST_TO_WALLET_ID`
- `FLOW_TEST_KEY`

Optional:

- `FLOW_TEST_AMOUNT` (default `0.00000001`)

### 3) SMS Webhook Security Smoke Test

Runs quick checks for:

- token validation (`401` on invalid token)
- malformed payload rejection (`400`)
- optional invalid command rejection (`400`)

```bash
pnpm test:security:sms
```

Notes:

- The app must be running (`pnpm dev` or `pnpm start`).
- `BASE_URL` defaults to `http://localhost:3000`.

### 4) Stress Test

Executes HTTP load testing with latency and throughput thresholds.

```bash
pnpm test:stress
```

Defaults:

- path: `/api/sms`
- method: `POST`
- connections: `50`
- duration: `30` seconds
- p99 threshold: `1500ms`
- minimum avg throughput: `20 req/sec`

Useful overrides:

- `STRESS_PATH`, `STRESS_METHOD`
- `STRESS_CONNECTIONS`, `STRESS_DURATION`, `STRESS_PIPELINING`
- `STRESS_MAX_P99_MS`, `STRESS_MIN_REQ_SEC`
- `STRESS_FROM_PHONE`, `STRESS_MESSAGE`, `BASE_URL`

Example:

```bash
STRESS_CONNECTIONS=100 STRESS_DURATION=60 STRESS_MAX_P99_MS=2000 pnpm test:stress
```

## Project Status

Implemented:

- Next.js 16 upgrade
- React 19 upgrade
- real Flow Testnet contract deployment
- backend signing support for Flow transactions
- SMS-based transfer execution flow
- staking contract and API integration
- P2P marketplace contract and API integration
- DeFi vault contract and API integration
- admin dashboard access flow fixed
- P2P marketplace product section and dashboard page

Still evolving:

- richer admin controls for contract operations
- full UI integration for DeFi and P2P on-chain actions
- production-grade key management
- secure secret rotation
- SMS provider integration for real telecom delivery
- stronger test coverage around Cadence interaction and provisioning

## Security Notes

- Do not commit private keys.
- Do not reuse test credentials in production.
- Move admin signing keys to a secure secrets manager before any production deployment.
- Treat `.pkey` files and `.env` values as sensitive.

## Vision

sms2flow is building a bridge between decentralized finance and real-world accessibility.

The long-term goal is simple:

make Flow-powered finance available to anyone who can send a text message.
