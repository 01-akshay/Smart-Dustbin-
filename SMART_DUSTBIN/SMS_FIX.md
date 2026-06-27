# SMS Kyu Nahi Aa Raha? - Fix

## Problem
`.env` file me abhi **REPLACE_WITH_YOUR_KEY** hai - ye placeholder hai. Real API key nahi hai.

## Solution - 3 Steps

### Step 1: Fast2SMS Account Banao
1. Open: **https://www.fast2sms.com**
2. Sign up karo (free, ₹50 credit milta hai)
3. Login karo

### Step 2: API Key Copy Karo
1. Dashboard me **Dev API** pe jao
2. **API KEY** tab kholo
3. Apna API key copy karo (long string hota hai, jaise: `abc123XYZ456...`)

### Step 3: .env File Me Paste Karo
1. `smart-dustbin` folder me `.env` file kholo
2. Line 5 pe hai: `FAST2SMS_API_KEY=REPLACE_WITH_YOUR_KEY`
3. **REPLACE_WITH_YOUR_KEY** delete karo aur apna API key paste karo
4. Save karo

**Example (sahi format):**
```
FAST2SMS_API_KEY=AbCdEfGhIjKlMnOpQrStUvWxYz123456789
```

**Galat (placeholder):**
```
FAST2SMS_API_KEY=REPLACE_WITH_YOUR_KEY
```

### Step 4: Server Restart
```bash
npm run server
```

### Step 5: Test Karo
Browser me kholo: **http://localhost:3001/test-sms**

Agar sahi key hai to dikhega: "✓ SMS bhej diya 9805493783 par!"
1-2 minute me phone par SMS aayega.
