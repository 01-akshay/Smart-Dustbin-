# SMS Phone Par Kaise Bheje? (9805493783)

Abhi SMS **simulated** hai - phone par nahi aata. Real SMS ke liye yeh karo:

## Step 1: Fast2SMS Signup (₹50 Free)

1. Open: **https://www.fast2sms.com**
2. Sign up karo – **₹50 free credit** milta hai
3. Login karo

## Step 2: API Key Lo

1. Dashboard me **Dev API** pe jao
2. **API KEY** tab kholo
3. Apna **API Key** copy karo

## Step 3: Project Me Set Karo

1. `smart-dustbin` folder me `.env` file banao
2. Usme likho:
```
FAST2SMS_API_KEY=apna_api_key_yahan_paste_karo
```

3. `.env.example` ko `.env` me rename kar sakte ho aur API key paste karo

## Step 4: Server Restart

```bash
npm run server
```

Ab jab gas ya dustbin full hoga, **9805493783** par real SMS jayega.

---

**Important:** Fast2SMS Quick SMS route use hota hai – DLT registration nahi chahiye. Per SMS cost lagti hai (free credit se cover hoga).
