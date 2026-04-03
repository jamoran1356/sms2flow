import { NextResponse } from "next/server"
import { processSmsCommand } from "@/lib/services/sms-command-processor"
import { normalizePhone } from "@/lib/flow"

/**
 * Twilio Webhook Endpoint
 * Receives POST from Twilio with: Body, From, To, MessageSid, etc.
 * Returns TwiML XML response to reply via SMS.
 *
 * Configure in Twilio Console:
 *   Webhook URL: https://your-domain.com/api/sms/twilio
 *   HTTP Method: POST
 */
export async function POST(request) {
  try {
    // Twilio sends application/x-www-form-urlencoded
    const contentType = request.headers.get("content-type") || ""
    let body
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData()
      body = Object.fromEntries(formData.entries())
    } else {
      body = await request.json()
    }

    const fromPhone = body.From || body.from || ""
    const message = body.Body || body.body || body.message || ""
    const messageSid = body.MessageSid || ""

    if (!fromPhone || !message) {
      return new Response(
        twiml("Mensaje invalido."),
        { status: 200, headers: { "Content-Type": "text/xml" } }
      )
    }

    const phone = normalizePhone(fromPhone)
    const result = await processSmsCommand(phone, message, {
      source: "twilio",
      messageSid,
    })

    return new Response(
      twiml(result.reply),
      { status: 200, headers: { "Content-Type": "text/xml" } }
    )
  } catch (error) {
    console.error("Twilio webhook error:", error)
    return new Response(
      twiml("Error al procesar tu mensaje. Intenta de nuevo."),
      { status: 200, headers: { "Content-Type": "text/xml" } }
    )
  }
}

/**
 * Generate a TwiML response XML string
 */
function twiml(messageBody) {
  // Escape XML special characters
  const escaped = String(messageBody || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escaped}</Message>
</Response>`
}
