# Xeno SDE Internship Assignment 2025 — Mini CRM

This is the **Mini CRM system** built as part of the Xeno SDE Internship Assignment 2025.  
It covers customer data ingestion, campaign creation, AI-driven audience segmentation, simulated communication delivery, and campaign history tracking.

---

## 📌 Features Implemented

### 🔹 Backend (Express + MongoDB)
- **Models**
  - `Customer`: Stores customer profile, spend, visits, etc.
  - `Campaign`: Stores targeting rules, conjunction, audience size, timestamps.
  - `CommunicationLog`: Tracks delivery status (`SENT` or `FAILED`) for each campaign send.
  - `Order`: Supports ingestion of order data.
- **APIs**
  - `/api/ingest` → Ingest customer and order data.
  - `/api/campaigns/preview` → Preview audience size before launching a campaign.
  - `/api/campaigns` → Create campaigns & list all past campaigns with stats.
  - `/api/delivery-receipt` → Delivery simulation (≈90% success, ≈10% failure).
  - `/api/ai/generate-rules` → AI-powered targeting rule generation (via Groq API).
  - `/auth/*` → Google OAuth 2.0 authentication (via Passport).
- **Services**
  - `campaignProcessor` → Handles audience selection (`findAudience`) & sending (`sendCommunication`).
- **Middleware**
  - Session management with `express-session`.
  - Passport for Google OAuth.
  - CORS with environment-based whitelisting.
- **Other**
  - Health/test endpoints (`/healthz`, `/api/ping`, `/api/campaigns/_test`).

---

### 🔹 Frontend (React + Vite + React Router)
- **Authentication**
  - Google OAuth login integrated with backend sessions.
  - `ProtectedRoute` wrapper to guard `/` and `/history`.
- **Pages**
  - `LoginPage` → Always public, no navbar.
  - `CampaignCreationPage` → Create a campaign with AI-generated rules, preview audience, save & launch.
  - `CampaignHistoryPage` → Fetches `/api/campaigns`, shows sent/failed stats, rules, and timestamps.
- **Components**
  - `Navbar` → Conditional rendering (hidden on login page).
  - `ProtectedRoute` → Guards private routes.
- **Communication**
  - API base managed via `VITE_API_URL` (set per environment).
  - Handles errors, loading states, and aborts gracefully.

---

## ⚙️ Tech Stack

- **Frontend**: React 19 + Vite + React Router
- **Backend**: Node.js + Express 5
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: Passport (Google OAuth 2.0)
- **AI**: Groq API integration
- **Deployment**:  
  - Frontend → Vercel  
  - Backend → Render/Railway  

---

## 📂 Project Structure

```

xeno-crm/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Navbar, ProtectedRoute
│   │   ├── pages/          # CampaignCreation, CampaignHistory, Login
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── ...
└── server/                 # Express backend
├── config/             # passport-setup.js
├── models/             # Customer, Campaign, CommunicationLog, Order
├── routes/             # campaignRoutes, aiRoutes, authRoutes, ...
├── services/           # campaignProcessor.js
├── index.js
├── package.json
└── ...

````

---

## 🚀 Setup & Local Development

### 1. Clone Repo
```bash
git clone https://github.com/<your-username>/<repo>.git
cd xeno-crm
````

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` in `/server`:

```env
PORT=5000
MONGO_URI=your-mongo-uri
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
GROQ_API_KEY=gsk_xxx
FRONTEND_URL=http://localhost:5173
```

Run dev server:

```bash
npm run dev   # nodemon index.js
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create `.env.local` in `/client`:

```env
VITE_API_URL=http://localhost:5000
```

Run dev server:

```bash
npm run dev   # starts Vite on http://localhost:5173
```

---

## 🌍 Deployment

### Backend → Render

1. Create new Web Service → Root Directory = `server/`
2. Build command:

   ```
   npm install
   ```

   Start command:

   ```
   node index.js
   ```
3. Set environment variables:

   * `MONGO_URI`
   * `SESSION_SECRET`
   * `GOOGLE_CLIENT_ID`
   * `GOOGLE_CLIENT_SECRET`
   * `GROQ_API_KEY`
   * `FRONTEND_URL=https://<your-frontend>.vercel.app`
   * (Render auto-assigns `PORT`)
4. Deploy → get URL like `https://xeno-crm-backend.onrender.com`

### Frontend → Vercel

1. Import repo → Root Directory = `client/`
2. Build command: `npm run build`
3. Output Directory: `dist`
4. Add env variable:

   * `VITE_API_URL=https://xeno-crm-backend.onrender.com`
5. Deploy → get URL like `https://xeno-crm.vercel.app`

---

## 🧪 Testing & Verification

* **Health checks**

  * `GET /__up` → `"UP"`
  * `GET /api/ping` → `{ ok: true, time: <timestamp> }`
  * `GET /api/campaigns/_test` → `{ ok: true, note: "mounted OK" }`

* **Campaign Flow**

  1. Ingest customer/order data → `/api/ingest`
  2. Generate rules with AI → `/api/ai/generate-rules`
  3. Preview audience → `/api/campaigns/preview`
  4. Launch campaign → `/api/campaigns`
  5. Check delivery logs → `/api/delivery-receipt`
  6. View history → frontend `/history` (calls `/api/campaigns`)

---

## 📹 Walkthrough Video (Optional)

* Show login with Google OAuth
* Create campaign with AI rules
* Preview & launch
* Show simulated delivery stats
* View campaign history page with sent/failed stats

---

## ✅ Assignment Coverage

* [x] Customer + Order data ingestion
* [x] Campaign creation with rule engine
* [x] AI rule generation (Groq)
* [x] Audience preview before launch
* [x] Simulated delivery with SENT/FAILED
* [x] Campaign history dashboard
* [x] Authentication (Google OAuth)
* [x] Deployment on Vercel + Render
