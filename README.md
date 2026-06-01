# PropertyOS – Lahore 🏠

AI-powered property management system for your Airbnb & Booking.com apartments in Lahore.

## Features
- 📊 Dashboard with revenue, expenses & occupancy
- 📅 Booking tracker (Airbnb + Booking.com)
- 💸 Expense logger by category & property
- 👥 Guest CRM with contact export (CSV)
- 🤖 AI Assistant (Claude-powered, knows your data)
- 📱 Mobile-first PWA — works on iPhone like a native app

---

## Deploy in 5 Minutes (Vercel)

### Step 1 — Get a free Anthropic API key
1. Go to https://console.anthropic.com/
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Upload to GitHub
1. Go to https://github.com and create a free account
2. Click **New repository** → name it `propertyos`
3. Upload all these files (drag & drop the whole folder)

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com and sign up with GitHub
2. Click **Add New Project** → Import your `propertyos` repo
3. Under **Environment Variables**, add:
   - Name: `VITE_ANTHROPIC_API_KEY`
   - Value: your key from Step 1
4. Click **Deploy** — done in ~60 seconds!

### Step 4 — Add to iPhone Home Screen
1. Open your Vercel URL in **Safari** on iPhone
2. Tap the **Share** button (box with arrow at bottom)
3. Tap **"Add to Home Screen"**
4. Tap **Add**
5. App icon appears on your home screen — opens full screen like a native app!

---

## Run Locally (optional)

```bash
npm install
cp .env.example .env
# edit .env and add your API key
npm run dev
```

Open http://localhost:5173

---

## Your Data
All bookings and expenses are saved to your browser's **localStorage** — data persists between sessions on the same device. To back up, use the CSV export in the Guests tab.

---

## Customise
- Edit `src/App.jsx` → `SEED_PROPERTIES` to add your real apartment names
- Edit `SEED_BOOKINGS` and `SEED_EXPENSES` to start fresh (clear the arrays)
- The AI assistant automatically uses all your live data as context

---

Built with React + Vite. Deployed free on Vercel.
