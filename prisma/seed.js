const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // --- Admin User ---
  const adminPassword = await bcrypt.hash("Admin123!", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@sms2flow.com" },
    update: {},
    create: {
      name: "Admin SMS2Flow",
      email: "admin@sms2flow.com",
      hashedPassword: adminPassword,
      role: "ADMIN",
      isActive: true,
      isVerified: true,
      emailVerified: new Date(),
    },
  })
  console.log(`  ✅ Admin user: ${admin.email}`)

  // --- Demo User ---
  const userPassword = await bcrypt.hash("User123!", 12)
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@sms2flow.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@sms2flow.com",
      hashedPassword: userPassword,
      role: "USER",
      isActive: true,
      isVerified: true,
      emailVerified: new Date(),
      phone: "+1234567890",
    },
  })
  console.log(`  ✅ Demo user: ${demoUser.email}`)

  // --- Admin Wallet ---
  await prisma.wallet.upsert({
    where: { address: "0xADMIN000000000001" },
    update: {},
    create: {
      userId: admin.id,
      address: "0xADMIN000000000001",
      network: "TESTNET",
      balance: 10000,
      isDefault: true,
    },
  })

  // --- Demo User Wallet ---
  await prisma.wallet.upsert({
    where: { address: "0xDEMO0000000000001" },
    update: {},
    create: {
      userId: demoUser.id,
      address: "0xDEMO0000000000001",
      network: "TESTNET",
      balance: 250,
      isDefault: true,
    },
  })
  console.log("  ✅ Wallets created")

  // --- Network Configs ---
  const networks = [
    { name: "Flow Testnet", network: "TESTNET", rpcUrl: "https://rest-testnet.onflow.org", explorerUrl: "https://testnet.flowscan.io", isActive: true, chainId: "flow-testnet" },
    { name: "Flow Mainnet", network: "MAINNET", rpcUrl: "https://rest-mainnet.onflow.org", explorerUrl: "https://flowscan.io", isActive: false, chainId: "flow-mainnet" },
    { name: "Flow Emulator", network: "EMULATOR", rpcUrl: "http://localhost:8888", explorerUrl: null, isActive: false, chainId: "flow-emulator" },
  ]
  for (const net of networks) {
    await prisma.networkConfig.upsert({
      where: { network: net.network },
      update: {},
      create: net,
    })
  }
  console.log("  ✅ Network configs")

  // --- Staking Pools ---
  const existingPools = await prisma.stakingPool.count()
  if (existingPools === 0) {
    await prisma.stakingPool.createMany({
      data: [
        { name: "FLOW Básico", token: "FLOW", apyRate: 5.5, minStake: 10, lockPeriodDays: 30, isActive: true },
        { name: "FLOW Premium", token: "FLOW", apyRate: 8.0, minStake: 100, maxStake: 50000, lockPeriodDays: 90, isActive: true },
        { name: "FLOW VIP", token: "FLOW", apyRate: 12.0, minStake: 1000, maxStake: 100000, lockPeriodDays: 180, isActive: true },
      ],
    })
    console.log("  ✅ Staking pools")
  }

  // --- System Settings ---
  const defaultSettings = [
    { key: "platform_name", value: "SMS2Flow", group: "general" },
    { key: "platform_currency", value: "FLOW", group: "general" },
    { key: "maintenance_mode", value: "false", group: "general" },
    { key: "active_network", value: "TESTNET", group: "blockchain" },
    { key: "gas_limit", value: "9999", group: "blockchain" },
    { key: "transaction_fee", value: "0.001", group: "blockchain" },
    { key: "email_notifications", value: "true", group: "notifications" },
    { key: "sms_notifications", value: "true", group: "notifications" },
    { key: "push_notifications", value: "false", group: "notifications" },
  ]
  for (const setting of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log("  ✅ System settings")

  // --- Seed Audit Log ---
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "SEED",
      entity: "System",
      details: { message: "Database seeded successfully" },
    },
  })
  console.log("  ✅ Audit log entry")

  console.log("\n🎉 Seed completed!")
  console.log("   Admin login: admin@sms2flow.com / Admin123!")
  console.log("   Demo login:  demo@sms2flow.com / User123!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
