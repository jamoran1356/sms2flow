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
  const existingAudit = await prisma.auditLog.count({ where: { action: "SEED", entity: "System" } })
  if (existingAudit === 0) {
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "SEED",
        entity: "System",
        details: { message: "Database seeded successfully" },
      },
    })
  }
  console.log("  ✅ Audit log entry")

  // --- P2P Marketplace Users ---
  const p2pUsers = []
  const p2pUserData = [
    { name: "Carlos Mendoza", email: "carlos@example.com", phone: "+573001234567" },
    { name: "María García", email: "maria@example.com", phone: "+573009876543" },
    { name: "Juan Pérez", email: "juan@example.com", phone: "+525512345678" },
    { name: "Ana Rodríguez", email: "ana@example.com", phone: "+5491112345678" },
    { name: "Roberto Silva", email: "roberto@example.com", phone: "+5511987654321" },
  ]
  for (const u of p2pUserData) {
    const p2pUser = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        phone: u.phone,
        hashedPassword: userPassword,
        role: "USER",
        isActive: true,
        isVerified: true,
        emailVerified: new Date(),
      },
    })
    p2pUsers.push(p2pUser)
  }
  console.log("  ✅ P2P marketplace users")

  // --- P2P Listings ---
  const existingListings = await prisma.p2pListing.count()
  if (existingListings === 0) {
    const listings = [
      {
        userId: p2pUsers[0].id,
        type: "SELL",
        amount: 500,
        price: 0.85,
        currency: "USD",
        minAmount: 50,
        maxAmount: 500,
        paymentMethod: "bank_transfer",
        description: "Transferencia Bancolombia o Nequi. Confirmación en menos de 10 minutos. Solo Colombia.",
        status: "ACTIVE",
      },
      {
        userId: p2pUsers[1].id,
        type: "BUY",
        amount: 1000,
        price: 0.82,
        currency: "USD",
        minAmount: 100,
        maxAmount: 1000,
        paymentMethod: "bank_transfer",
        description: "Compro FLOW pagando por Davivienda o Bancolombia. Pago inmediato después de verificar transacción.",
        status: "ACTIVE",
      },
      {
        userId: p2pUsers[2].id,
        type: "SELL",
        amount: 2000,
        price: 14.50,
        currency: "MXN",
        minAmount: 200,
        maxAmount: 2000,
        paymentMethod: "mobile_payment",
        description: "Acepto transferencia SPEI o pago por Mercado Pago. Horario: 9am-9pm CDT. Respuesta rápida.",
        status: "ACTIVE",
      },
      {
        userId: p2pUsers[3].id,
        type: "BUY",
        amount: 300,
        price: 0.80,
        currency: "USD",
        minAmount: 10,
        maxAmount: 300,
        paymentMethod: "bank_transfer",
        description: "Pago por transferencia bancaria Argentina (CBU/CVU) o Mercado Pago. Monto mínimo 10 FLOW.",
        status: "ACTIVE",
      },
      {
        userId: p2pUsers[4].id,
        type: "SELL",
        amount: 5000,
        price: 4.25,
        currency: "BRL",
        minAmount: 500,
        maxAmount: 5000,
        paymentMethod: "mobile_payment",
        description: "PIX instantâneo. Envie o comprovante pelo chat. Disponível 24h.",
        status: "ACTIVE",
      },
      {
        userId: p2pUsers[0].id,
        type: "BUY",
        amount: 800,
        price: 3200,
        currency: "COP",
        minAmount: 100,
        maxAmount: 800,
        paymentMethod: "bank_transfer",
        description: "Compro FLOW a 3.200 COP por unidad. Pago Nequi o Daviplata al instante. Solo montos mayores a 100 FLOW.",
        status: "ACTIVE",
      },
      {
        userId: demoUser.id,
        type: "SELL",
        amount: 150,
        price: 0.88,
        currency: "USD",
        minAmount: 10,
        maxAmount: 150,
        paymentMethod: "bank_transfer",
        description: "Vendo FLOW rápido. Acepto Zelle, Wire o ACH. Horario flexible.",
        status: "ACTIVE",
      },
      {
        userId: p2pUsers[2].id,
        type: "BUY",
        amount: 3000,
        price: 14.20,
        currency: "MXN",
        minAmount: 500,
        maxAmount: 3000,
        paymentMethod: "bank_transfer",
        description: "Compro FLOW en volumen. SPEI inmediato. Trader verificado con más de 50 operaciones.",
        status: "ACTIVE",
      },
    ]

    await prisma.p2pListing.createMany({ data: listings })
    console.log("  ✅ P2P marketplace listings (8 anuncios)")
  }

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
