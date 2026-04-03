import { NextResponse } from "next/server"

/**
 * Test Twilio credentials by calling the Twilio API.
 * POST { accountSid, authToken }
 * Returns { ok: true, accountName } or { ok: false, error }
 */
export async function POST(request) {
  try {
    const { accountSid, authToken } = await request.json()

    if (!accountSid || !authToken) {
      return NextResponse.json({ ok: false, error: "accountSid and authToken required" }, { status: 400 })
    }

    // Validate credentials by calling the Twilio Account API
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64")
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
      headers: { Authorization: `Basic ${credentials}` },
    })

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" })
    }

    const data = await res.json()

    return NextResponse.json({
      ok: true,
      accountName: data.friendly_name,
      status: data.status,
    })
  } catch (error) {
    console.error("Twilio test error:", error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
