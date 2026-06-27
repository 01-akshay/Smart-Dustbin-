# Smart Waste Dustbin - Web Dashboard

Web dashboard for Smart Waste Management Dustbin project. Displays live gas sensor and dustbin fill level with semi-circular gauges, clock, and SMS history.

## Hardware Components

| Component | Quantity |
|-----------|----------|
| Arduino Uno | 1 |
| Ultrasonic Sensor (HC-SR04) | 2 |
| Servo Motor (SG90) | 1 |
| MQ-135 Gas sensor | 1 |
| MQ-135 Gas Sensor module | 1 |
| Large Breadboard | 1 |
| Jumper Wires | 30 |
| USB Cable | 1 |

## Run Web Page

```bash
npm install
npm run dev
npm run server   # SMS ke liye alag terminal me
```

Open http://localhost:5173/

## SMS Number & Messages

- **Phone:** 9805493783 (`src/config.js`)
- **Harmful Gas Message:** "ALERT: Dustbin me harmful gas ban rahi hai! Dustbin X% full, Gas Y%. Kripa karke turant khali karo."
- **Dustbin Full Message:** "ALERT: Aapka dustbin X% bhar gaya hai. Kripa karke turant khali karo."

Real SMS ke liye Twilio ya MSG91 API keys set karo (`.env`):
- Twilio: `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE`
- MSG91: `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`

## Features

- **Gas Sensor Gauge** – Normal, Mid, Dangerous level with live needle
- **Dustbin Fill Gauge** – 20%, 40%, 60%, 80%, 100% with live needle
- **Clock** – Real-time clock in center
- **SMS History** – Popup with message history (click top-right button, close with ✕)
- Simulated live data for demo – replace with Arduino/Serial data for real hardware

## Arduino Connection (Future)

USB cable se Arduino laptop se connect karke live data bhej sakte ho. Arduino code se Serial port par JSON bhejna hoga, phir Web Serial API ya backend se web page ko data mil sakta hai.
