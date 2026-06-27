import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 3001

// Phone number and messages
const PHONE = '9805493783'
const GAS_MESSAGE = 'ALERT: Dustbin me harmful gas ban rahi hai! Kripa karke turant khali karo. - Smart Waste Dustbin'
const DUSTBIN_MESSAGE = 'ALERT: Aapka dustbin bhar gaya hai. Kripa karke turant khali karo. - Smart Waste Dustbin'

// SMS API - Twilio (set env vars: TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE)
// Or use MSG91 / Fast2SMS for India
app.post('/send-sms', async (req, res) => {
  const { type, message, dustbinLevel, gasLevel } = req.body

  let smsMessage = message
  if (type === 'gas') {
    smsMessage = `ALERT:Harmful gas is forming in the dustbin! Dustbin is ${dustbinLevel || 0}% full, Gas is ${gasLevel || 0}%. Please empty it immediately. – Smart Waste Dustbin`
  } else if (type === 'dustbin') {
    smsMessage = `ALERT: Your dustbin is ${dustbinLevel || 0}% full. Please empty it immediately. – Smart Waste Dustbin`
  }

  const to = `+91${PHONE}`

  try {
    // Option 1: Twilio
    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = require('twilio')
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
      await client.messages.create({
        body: smsMessage,
        from: process.env.TWILIO_PHONE,
        to,
      })
      return res.json({ success: true, provider: 'twilio' })
    }

    // Option 2: MSG91 (India) - https://msg91.com
    if (process.env.MSG91_AUTH_KEY) {
      const response = await fetch('https://api.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: process.env.MSG91_AUTH_KEY,
        },
        body: JSON.stringify({
          template_id: process.env.MSG91_TEMPLATE_ID,
          short_url: '0',
          recipients: [{ mobiles: `91${PHONE}`, message: smsMessage }],
        }),
      })
      if (response.ok) return res.json({ success: true, provider: 'msg91' })
    }

    // Option 3: Fast2SMS (India) - ₹50 free credit after signup
    const fast2Key = process.env.FAST2SMS_API_KEY?.trim()
    const hasValidFast2Key = fast2Key && !fast2Key.includes('REPLACE') && fast2Key.length > 20
    if (hasValidFast2Key) {
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2Key}&message=${encodeURIComponent(smsMessage)}&route=q&numbers=${PHONE}`
      const response = await fetch(url)
      const data = await response.json()
      console.log('[Fast2SMS] Response:', JSON.stringify(data))
      if (data.return) {
        console.log(`[Fast2SMS] SMS sent to ${PHONE} ✓`)
        return res.json({ success: true, provider: 'fast2sms' })
      }
      const errMsg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Fast2SMS failed')
      console.error('[Fast2SMS] Error:', errMsg)
      throw new Error(errMsg)
    }

    // No SMS provider configured - log only
    console.log(`[SMS Simulated] To: ${to} | (Real SMS ke liye .env me FAST2SMS_API_KEY set karo)`)
    res.json({ success: true, simulated: true })
  } catch (err) {
    console.error('SMS Error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// Test SMS - browser me kholo: http://localhost:3001/test-sms
app.get('/test-sms', async (req, res) => {
  const msg = 'Test: Smart Dustbin - 9805493783 par ye msg aaya?'
  try {
    const fast2Key = process.env.FAST2SMS_API_KEY?.trim()
    const hasValidKey = fast2Key && !fast2Key.includes('REPLACE') && fast2Key.length > 20
    if (!hasValidKey) {
      return res.send('❌ .env me apna Fast2SMS API key daalo. Abhi REPLACE_WITH_YOUR_KEY hai - isko https://www.fast2sms.com se mile API key se replace karo.')
    }
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2Key}&message=${encodeURIComponent(msg)}&route=q&numbers=${PHONE}`
    const response = await fetch(url)
    const data = await response.json()
    if (data.return) {
      res.send(`✓ SMS bhej diya ${PHONE} par! 1-2 min me aayega.`)
    } else {
      res.send(`✗ Fast2SMS error: ${JSON.stringify(data)}`)
    }
  } catch (e) {
    res.send(`✗ Error: ${e.message}`)
  }
})

app.listen(PORT, () => {
  console.log(`SMS Server running on http://localhost:${PORT}`)
  const fast2Key = process.env.FAST2SMS_API_KEY?.trim()
  const hasValidFast2 = fast2Key && !fast2Key.includes('REPLACE') && fast2Key.length > 20
  if (!hasValidFast2 && !process.env.TWILIO_SID && !process.env.MSG91_AUTH_KEY) {
    console.log('⚠️  Real SMS ke liye: .env me FAST2SMS_API_KEY set karo (SMS_SETUP.md dekho)')
  }
})


// ===============================
// ARDUINO SERIAL LIVE DATA CODE
// ===============================

import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

const serialPort = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
})

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }))

let latestData = { dustbin: 0, gas: 0 }

parser.on('data', (line) => {

  console.log("Arduino:", line)

  const match = line.match(/D:(\d+),G:(\d+)/)

  if (match) {

    latestData.dustbin = parseInt(match[1])
    latestData.gas = parseInt(match[2])

  }

})

app.get('/api/live', (req, res) => {

  res.json(latestData)

})
