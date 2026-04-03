import prisma from "@/lib/prisma"
import {
  normalizePhone,
  parseSmsTransferWithKeyCommand,
  parseSmsConfirmCommand,
  createFlowWallet,
  getFlowBalance,
  virtualWalletIdFromUserId,
} from "@/lib/flow"
import { getContractAddresses, hasFlowAdminConfig, sendTransaction } from "@/lib/flow-onchain"

// ─── Command Parsers ──────────────────────────────────────────────

function parseRegisterCommand(message) {
  const m = String(message).trim().match(
    /^(?:SMS2FLOW\s+)?(?:REGISTER|REGISTRO|REG)\s+(.+)$/i
  )
  if (!m) return null
  const parts = m[1].trim().split(/\s+/)
  const name = parts.join(" ")
  return { name }
}

function parseBalanceCommand(message) {
  const m = String(message).trim().match(
    /^(?:SMS2FLOW\s+)?(?:BALANCE|SALDO|BAL)$/i
  )
  return m ? {} : null
}

function parseHistoryCommand(message) {
  const m = String(message).trim().match(
    /^(?:SMS2FLOW\s+)?(?:HISTORY|HISTORIAL|HIST)(?:\s+(\d+))?$/i
  )
  if (!m) return null
  return { limit: Number(m[1]) || 5 }
}

function parseHelpCommand(message) {
  const m = String(message).trim().match(
    /^(?:SMS2FLOW\s+)?(?:HELP|AYUDA|\?)$/i
  )
  return m ? {} : null
}

function parseP2pSellCommand(message) {
  // SELL 100 FLOW 4.5 USD [Transferencia bancaria]
  const m = String(message).trim().match(
    /^(?:SMS2FLOW\s+)?(?:SELL|VENDER)\s+([0-9]+(?:\.[0-9]+)?)\s+(?:FLOW\s+)?([0-9]+(?:\.[0-9]+)?)\s+([A-Z]{3})(?:\s+(.+))?$/i
  )
  if (!m) return null
  return {
    amount: Number(m[1]),
    price: Number(m[2]),
    currency: m[3].toUpperCase(),
    paymentMethod: m[4]?.trim() || "bank_transfer",
  }
}

function parseP2pBuyCommand(message) {
  // P2PBUY 100 FLOW 4.5 USD [Transferencia bancaria]
  const m = String(message).trim().match(
    /^(?:SMS2FLOW\s+)?(?:P2PBUY|COMPRAR)\s+([0-9]+(?:\.[0-9]+)?)\s+(?:FLOW\s+)?([0-9]+(?:\.[0-9]+)?)\s+([A-Z]{3})(?:\s+(.+))?$/i
  )
  if (!m) return null
  return {
    amount: Number(m[1]),
    price: Number(m[2]),
    currency: m[3].toUpperCase(),
    paymentMethod: m[4]?.trim() || "bank_transfer",
  }
}

function parseP2pListCommand(message) {
  const m = String(message).trim().match(
    /^(?:SMS2FLOW\s+)?(?:P2PLIST|MERCADO|MARKET)(?:\s+(BUY|SELL|COMPRAR|VENDER))?$/i
  )
  if (!m) return null
  const typeMap = { BUY: "BUY", SELL: "SELL", COMPRAR: "BUY", VENDER: "SELL" }
  return { type: m[1] ? typeMap[m[1].toUpperCase()] : null }
}

function parseMachineBuyCommand(message) {
  const text = String(message || "").trim()
  const match = text.match(/^BUY\s+(\d+)\s+(\d+)(?:\s+REF\s+([A-Za-z0-9_:\-.]+))?$/i)
  if (!match) return null
  return {
    machineId: Number(match[1]),
    productId: Number(match[2]),
    smsReference: match[3] || null,
  }
}

// ─── Command Identifier ──────────────────────────────────────────

export function identifyCommand(message) {
  const text = String(message || "").trim()
  if (parseHelpCommand(text)) return "HELP"
  if (parseRegisterCommand(text)) return "REGISTER"
  if (parseBalanceCommand(text)) return "BALANCE"
  if (parseSmsTransferWithKeyCommand(text)) return "SEND"
  if (parseSmsConfirmCommand(text)) return "CONFIRM"
  if (parseP2pSellCommand(text)) return "P2P_SELL"
  if (parseP2pBuyCommand(text)) return "P2P_BUY"
  if (parseP2pListCommand(text)) return "P2P_LIST"
  if (parseHistoryCommand(text)) return "HISTORY"
  if (parseMachineBuyCommand(text)) return "MACHINE_BUY"
  return "UNKNOWN"
}

// ─── Command Handlers ────────────────────────────────────────────

async function handleHelp() {
  return {
    ok: true,
    reply:
      "SMS2Flow - Comandos disponibles:\n" +
      "REGISTER <nombre> - Crear cuenta\n" +
      "BALANCE - Ver tu saldo\n" +
      "SEND <monto> TO <telefono> KEY <clave> - Enviar FLOW\n" +
      "CONFIRM <id> <clave> - Confirmar envio\n" +
      "SELL <monto> <precio> <moneda> - Vender FLOW (P2P)\n" +
      "P2PBUY <monto> <precio> <moneda> - Comprar FLOW (P2P)\n" +
      "MARKET [BUY|SELL] - Ver anuncios P2P\n" +
      "HISTORY [n] - Ultimas transacciones\n" +
      "HELP - Ver esta ayuda",
  }
}

async function handleRegister(fromPhone, message) {
  const parsed = parseRegisterCommand(message)
  if (!parsed) return { ok: false, reply: "Formato: REGISTER <nombre>" }

  const existing = await prisma.user.findFirst({ where: { phone: fromPhone } })
  if (existing) {
    return { ok: false, reply: `Ya tienes una cuenta registrada como ${existing.name}.` }
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      phone: fromPhone,
      isVerified: true,
    },
  })

  let walletInfo = ""
  try {
    const wallet = await createFlowWallet()
    await prisma.wallet.create({
      data: {
        userId: user.id,
        address: wallet.address,
        privateKey: wallet.privateKey,
        network: "TESTNET",
        isDefault: true,
      },
    })
    walletInfo = ` Billetera: ${wallet.address}`
  } catch (e) {
    console.error("Wallet creation in register:", e)
    walletInfo = " (billetera pendiente)"
  }

  return {
    ok: true,
    reply: `Cuenta creada! Bienvenido ${parsed.name}.${walletInfo}`,
    userId: user.id,
  }
}

async function handleBalance(fromPhone, senderUser) {
  if (!senderUser) {
    return { ok: false, reply: "No tienes cuenta. Envia REGISTER <tu nombre> para crear una." }
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: senderUser.id },
    orderBy: { isDefault: "desc" },
  })

  if (wallets.length === 0) {
    return { ok: false, reply: "No tienes billeteras configuradas." }
  }

  let reply = "Tus saldos:\n"
  for (const w of wallets) {
    const def = w.isDefault ? " (principal)" : ""
    const bal = Number(w.balance).toFixed(4)
    reply += `${w.address.slice(0, 6)}...${w.address.slice(-4)}: ${bal} FLOW${def}\n`
  }
  return { ok: true, reply: reply.trim() }
}

async function handleSend(fromPhone, message, senderUser) {
  if (!senderUser) {
    return { ok: false, reply: "No tienes cuenta. Envia REGISTER <tu nombre> para crear una." }
  }

  const parsed = parseSmsTransferWithKeyCommand(message)
  if (!parsed) return { ok: false, reply: "Formato: SEND <monto> TO <telefono> KEY <clave>" }

  if (!hasFlowAdminConfig()) {
    return { ok: false, reply: "El sistema no esta configurado para transacciones on-chain." }
  }

  const senderWallet = await prisma.wallet.findFirst({
    where: { userId: senderUser.id, isDefault: true },
  })
  if (!senderWallet) {
    return { ok: false, reply: "No tienes billetera configurada." }
  }

  if (Number(senderWallet.balance) < parsed.amount) {
    return { ok: false, reply: `Saldo insuficiente. Tienes ${Number(senderWallet.balance).toFixed(4)} FLOW.` }
  }

  const receiverUser = await prisma.user.findFirst({ where: { phone: parsed.toPhone } })
  if (!receiverUser) {
    return { ok: false, reply: `El numero ${parsed.toPhone} no esta registrado en SMS2Flow.` }
  }

  const receiverWallet = await prisma.wallet.findFirst({
    where: { userId: receiverUser.id, isDefault: true },
  })
  if (!receiverWallet) {
    return { ok: false, reply: "El destinatario no tiene billetera configurada." }
  }

  const contracts = getContractAddresses()

  const requestTx = await sendTransaction({
    cadence: `
      import SMS2FlowCommandTransfer from 0xCOMMAND_TRANSFER

      transaction(fromVirtualWalletId: String, toVirtualWalletId: String, amount: UFix64, confirmationKey: String) {
        prepare(signer: auth(BorrowValue) &Account) {}
        execute {
          SMS2FlowCommandTransfer.requestTransfer(
            fromVirtualWalletId: fromVirtualWalletId,
            toVirtualWalletId: toVirtualWalletId,
            amount: amount,
            confirmationKey: confirmationKey
          )
        }
      }
    `,
    imports: { "0xCOMMAND_TRANSFER": contracts.commandTransfer },
    args: (arg, t) => [
      arg(virtualWalletIdFromUserId(senderUser.id), t.String),
      arg(virtualWalletIdFromUserId(receiverUser.id), t.String),
      arg(Number(parsed.amount).toFixed(8), t.UFix64),
      arg(parsed.confirmationKey, t.String),
    ],
  })

  if (requestTx.statusCode !== 0) {
    return { ok: false, reply: "Error en la transaccion on-chain." }
  }

  const transferIdEvent = (requestTx.events || []).find((e) =>
    String(e.type || "").includes("SMS2FlowCommandTransfer.TransferRequested")
  )
  const transferId = Number(
    transferIdEvent?.data?.transferId ||
    transferIdEvent?.payload?.value?.fields?.find((f) => f.name === "transferId")?.value?.value ||
    0
  )

  const pendingTx = await prisma.transaction.create({
    data: {
      senderId: senderUser.id,
      receiverId: receiverUser.id,
      fromWalletId: senderWallet.id,
      toWalletId: receiverWallet.id,
      type: "SMS_PAYMENT",
      amount: parsed.amount,
      fee: 0.001,
      currency: "FLOW",
      status: "PENDING",
      network: senderWallet.network,
      description: `SMS transfer to ${parsed.toPhone}`,
      txHash: requestTx.txId,
      metadata: {
        source: "sms-command",
        flowCommandTransferId: transferId,
        fromPhone,
        toPhone: parsed.toPhone,
        confirmationKeyHint: `***${parsed.confirmationKey.slice(-2)}`,
        stage: "REQUESTED",
      },
    },
  })

  return {
    ok: true,
    reply: `Transferencia solicitada. Responde: CONFIRM ${transferId} ${parsed.confirmationKey}`,
    transaction: pendingTx,
    transferId,
  }
}

async function handleConfirm(fromPhone, message, senderUser) {
  if (!senderUser) {
    return { ok: false, reply: "No tienes cuenta registrada." }
  }

  const parsed = parseSmsConfirmCommand(message)
  if (!parsed) return { ok: false, reply: "Formato: CONFIRM <id> <clave>" }

  const pending = await prisma.transaction.findFirst({
    where: {
      senderId: senderUser.id,
      status: "PENDING",
      type: "SMS_PAYMENT",
    },
    orderBy: { createdAt: "desc" },
  })

  const matchedTx = pending && Number(pending.metadata?.flowCommandTransferId || 0) === parsed.transferId
    ? pending : null

  if (!matchedTx) {
    return { ok: false, reply: `No se encontro la transferencia #${parsed.transferId}.` }
  }

  if (!hasFlowAdminConfig()) {
    return { ok: false, reply: "Sistema no configurado para on-chain." }
  }

  const contracts = getContractAddresses()

  const confirmTx = await sendTransaction({
    cadence: `
      import SMS2FlowCommandTransfer from 0xCOMMAND_TRANSFER

      transaction(transferId: UInt64, confirmationKey: String) {
        prepare(signer: auth(BorrowValue) &Account) {}
        execute {
          SMS2FlowCommandTransfer.confirmTransfer(transferId: transferId, confirmationKey: confirmationKey)
        }
      }
    `,
    imports: { "0xCOMMAND_TRANSFER": contracts.commandTransfer },
    args: (arg, t) => [
      arg(String(parsed.transferId), t.UInt64),
      arg(parsed.confirmationKey, t.String),
    ],
  })

  if (confirmTx.statusCode !== 0) {
    return { ok: false, reply: "Error al confirmar la transferencia on-chain." }
  }

  const completedTx = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: matchedTx.fromWalletId },
      data: { balance: { decrement: Number(matchedTx.amount) } },
    })
    await tx.wallet.update({
      where: { id: matchedTx.toWalletId },
      data: { balance: { increment: Number(matchedTx.amount) } },
    })
    return tx.transaction.update({
      where: { id: matchedTx.id },
      data: {
        status: "COMPLETED",
        txHash: confirmTx.txId,
        metadata: {
          ...(matchedTx.metadata || {}),
          stage: "CONFIRMED",
          confirmedAt: new Date().toISOString(),
          confirmationTxId: confirmTx.txId,
        },
      },
    })
  })

  const amt = Number(completedTx.amount).toFixed(4)
  return {
    ok: true,
    reply: `Transferencia #${parsed.transferId} confirmada! ${amt} FLOW enviados.`,
    transaction: completedTx,
  }
}

async function handleHistory(fromPhone, message, senderUser) {
  if (!senderUser) {
    return { ok: false, reply: "No tienes cuenta registrada." }
  }

  const parsed = parseHistoryCommand(message)
  const limit = parsed?.limit || 5

  const txs = await prisma.transaction.findMany({
    where: {
      OR: [{ senderId: senderUser.id }, { receiverId: senderUser.id }],
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { sender: true, receiver: true },
  })

  if (txs.length === 0) {
    return { ok: true, reply: "No tienes transacciones." }
  }

  let reply = `Ultimas ${txs.length} transacciones:\n`
  for (const tx of txs) {
    const dir = tx.senderId === senderUser.id ? "→" : "←"
    const other = tx.senderId === senderUser.id
      ? (tx.receiver?.phone || tx.receiver?.name || "?")
      : (tx.sender?.phone || tx.sender?.name || "?")
    const amt = Number(tx.amount).toFixed(4)
    reply += `${dir} ${amt} FLOW ${other} [${tx.status}]\n`
  }
  return { ok: true, reply: reply.trim() }
}

async function handleP2pSell(fromPhone, message, senderUser) {
  if (!senderUser) {
    return { ok: false, reply: "No tienes cuenta registrada." }
  }

  const parsed = parseP2pSellCommand(message)
  if (!parsed) return { ok: false, reply: "Formato: SELL <monto> <precio> <moneda>" }

  const listing = await prisma.p2pListing.create({
    data: {
      userId: senderUser.id,
      type: "SELL",
      amount: parsed.amount,
      price: parsed.price,
      currency: parsed.currency,
      paymentMethod: parsed.paymentMethod,
      description: `Venta via SMS por ${senderUser.phone}`,
    },
  })

  return {
    ok: true,
    reply: `Anuncio de venta creado! ${parsed.amount} FLOW a ${parsed.price} ${parsed.currency}. ID: ${listing.id.slice(-6)}`,
  }
}

async function handleP2pBuy(fromPhone, message, senderUser) {
  if (!senderUser) {
    return { ok: false, reply: "No tienes cuenta registrada." }
  }

  const parsed = parseP2pBuyCommand(message)
  if (!parsed) return { ok: false, reply: "Formato: P2PBUY <monto> <precio> <moneda>" }

  const listing = await prisma.p2pListing.create({
    data: {
      userId: senderUser.id,
      type: "BUY",
      amount: parsed.amount,
      price: parsed.price,
      currency: parsed.currency,
      paymentMethod: parsed.paymentMethod,
      description: `Compra via SMS por ${senderUser.phone}`,
    },
  })

  return {
    ok: true,
    reply: `Anuncio de compra creado! ${parsed.amount} FLOW a ${parsed.price} ${parsed.currency}. ID: ${listing.id.slice(-6)}`,
  }
}

async function handleP2pList(fromPhone, message) {
  const parsed = parseP2pListCommand(message)
  const where = { status: "ACTIVE" }
  if (parsed?.type) where.type = parsed.type

  const listings = await prisma.p2pListing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true },
  })

  if (listings.length === 0) {
    return { ok: true, reply: "No hay anuncios activos en el mercado P2P." }
  }

  let reply = "Mercado P2P:\n"
  for (const l of listings) {
    const tipo = l.type === "SELL" ? "VENDE" : "COMPRA"
    const amt = Number(l.amount).toFixed(2)
    const price = Number(l.price).toFixed(2)
    reply += `${tipo} ${amt} FLOW @ ${price} ${l.currency} - ${l.user?.name || l.user?.phone || "?"}\n`
  }
  return { ok: true, reply: reply.trim() }
}

// ─── Main Processor ──────────────────────────────────────────────

/**
 * Process an SMS command and return a response.
 * @param {string} fromPhone - Normalized phone number of sender
 * @param {string} message - Raw SMS message text
 * @param {object} options - { source: "simulator" | "twilio" | "webhook" }
 * @returns {{ ok: boolean, reply: string, command: string, ... }}
 */
export async function processSmsCommand(fromPhone, message, options = {}) {
  const phone = normalizePhone(fromPhone)
  const text = String(message || "").trim()
  const command = identifyCommand(text)
  const source = options.source || "webhook"

  // Find sender user (may be null for REGISTER and HELP)
  const senderUser = await prisma.user.findFirst({ where: { phone } })

  // Record SMS message
  const smsRecord = await prisma.smsMessage.create({
    data: {
      userId: senderUser?.id || null,
      fromPhone: phone,
      toPhone: process.env.SMS_INBOX_NUMBER || "sms2flow",
      message: text,
      command,
      amount: null,
      status: "received",
    },
  })

  let result
  try {
    switch (command) {
      case "HELP":
        result = await handleHelp()
        break
      case "REGISTER":
        result = await handleRegister(phone, text)
        break
      case "BALANCE":
        result = await handleBalance(phone, senderUser)
        break
      case "SEND":
        result = await handleSend(phone, text, senderUser)
        break
      case "CONFIRM":
        result = await handleConfirm(phone, text, senderUser)
        break
      case "HISTORY":
        result = await handleHistory(phone, text, senderUser)
        break
      case "P2P_SELL":
        result = await handleP2pSell(phone, text, senderUser)
        break
      case "P2P_BUY":
        result = await handleP2pBuy(phone, text, senderUser)
        break
      case "P2P_LIST":
        result = await handleP2pList(phone, text)
        break
      default:
        result = {
          ok: false,
          reply: "Comando no reconocido. Envia HELP para ver los comandos disponibles.",
        }
    }
  } catch (err) {
    console.error(`SMS command error [${command}]:`, err)
    result = { ok: false, reply: "Error interno al procesar tu mensaje." }
  }

  // Update SMS record
  await prisma.smsMessage.update({
    where: { id: smsRecord.id },
    data: {
      status: result.ok ? "processed" : "failed",
      processedAt: new Date(),
    },
  })

  return {
    ...result,
    command,
    source,
    smsMessageId: smsRecord.id,
  }
}
