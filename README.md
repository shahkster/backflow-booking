# How to Deploy Your Backflow Booking Site

Total time: ~15 minutes. Total cost: $0 (or $12/year if you want a custom domain).

---

## Step 1: Get your email key (2 minutes)

1. Go to **https://web3forms.com**
2. Enter your email address
3. They instantly email you an **access key**
4. Open `src/App.jsx` → find `YOUR_KEY_HERE` at the top → paste your key there

Now every booking auto-emails you with the customer's name, phone, email, address, date, time, services, and total.

**Want the customer to also get a confirmation email?**
Log into web3forms.com → Dashboard → Settings → turn on "Auto Response" → customize the message.

---

## Step 2: Create a GitHub account (3 minutes)

1. Go to **https://github.com** → Sign up (free)
2. Click the **+** button (top right) → **New repository**
3. Name it `backflow-booking`
4. Keep it **Public**
5. Click **Create repository**

---

## Step 3: Upload your files (3 minutes)

On your new repo page:
1. Click **"uploading an existing file"** (the link in the middle of the page)
2. Drag the ENTIRE `deploy` folder contents into the upload area:
   - `package.json`
   - `vite.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `index.html`
   - `src/` folder (with `main.jsx`, `App.jsx`, `index.css`)
3. Click **Commit changes**

**Important:** make sure `package.json` and `index.html` are at the ROOT level, not inside a subfolder.

---

## Step 4: Deploy on Vercel (5 minutes)

1. Go to **https://vercel.com** → Sign up with your GitHub account
2. Click **"Add New Project"**
3. Find your `backflow-booking` repo → click **Import**
4. Leave all settings as-is (Vercel auto-detects Vite)
5. Click **Deploy**
6. Wait ~2 minutes

**Done.** Your site is now live at `backflow-booking.vercel.app` (or similar).

---

## Step 5 (Optional): Add a custom domain ($12/year)

1. Buy a domain at **https://cloudflare.com** → Registrar
   - Ideas: `greatneckbackflow.com`, `shahkoohibackflow.com`
2. In Vercel → your project → **Settings** → **Domains** → Add your domain
3. Vercel gives you 2 DNS records to add in Cloudflare
4. Add them in Cloudflare → DNS → Add Record
5. Wait 5-10 minutes → your domain is live

---

## How to make changes later

1. Edit `src/App.jsx` in GitHub (click the file → pencil icon → edit → commit)
2. Vercel auto-deploys within 60 seconds
3. Your live site updates automatically

Things you can change at the top of `App.jsx`:
- Company name
- Phone number
- Service names, descriptions, and durations
- Pricing
- Neighborhoods
- Sunday windows / weekday hours
- Web3Forms key

---

## Summary

| What | Where | Cost |
|------|-------|------|
| Email on booking | web3forms.com | Free (250/mo) |
| Code hosting | github.com | Free |
| Website hosting | vercel.com | Free |
| Domain (optional) | cloudflare.com | ~$12/year |
| **Total** | | **$0 – $12/year** |
