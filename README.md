# Xeno SDE Internship Assignment 2025 – Mini CRM

This repository contains my submission for the **Xeno SDE Internship Assignment 2025**.  
The goal was to build a **Mini CRM Platform** that enables customer segmentation, personalized campaign delivery, and intelligent insights.

---

## 🚀 Live Links

- **Frontend (Vercel):** https://xeno-crm-sigma.vercel.app/  
- **Backend (Render):** https://<your-render-backend>.onrender.com  

---

## 📌 Features Implemented

### 1. Data Ingestion APIs
- REST APIs to ingest **Customers** and **Orders** into MongoDB.
- Implemented in Express.js with validation and schema checks.
- Supports Postman/Swagger testing.
- ✅ Extensible for pub-sub architecture (e.g., Kafka, RabbitMQ).

### 2. Campaign Creation UI
- React (Vite) frontend with **dynamic rule builder**:
  - Define audience segments (`spend > 10000 AND visits < 3`).
  - Supports AND/OR combinations.
- **Audience Preview**: Shows matching count before saving.
- After saving → redirects to **Campaign History** page.

### 3. Campaign Delivery & Logging
- On saving:
  - Campaign stored in DB.
  - Audience resolved via `findAudience`.
  - **Simulated delivery** (~90% SENT, ~10% FAILED).
  - Logs persisted in `CommunicationLog`.
- Delivery Receipt API updates status in DB.

### 4. Authentication
- **Google OAuth 2.0** with Passport.
- Only logged-in users can:
  - Create campaigns.
  - View campaign history.
- Session-based auth stored via `express-session`.

### 5. AI Integration
- Integrated **Groq API** for **Natural Language → Rules**.  
  Example: `"Users who spent > 5000 and visited < 3"` → strict JSON rules for the rule engine.

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, React Router
- **Backend:** Node.js (Express 5), MongoDB (Mongoose)
- **Auth:** Passport (Google OAuth 2.0)
- **AI:** Groq API
- **Deployment:**  
  - Frontend → Vercel  
  - Backend → Render  

---

## 📂 Project Structure

```

xeno-crm/
├── client/                 # Frontend (React + Vite)
│   ├── src/pages/          # CampaignCreation, CampaignHistory, Login
│   ├── src/components/     # Navbar, ProtectedRoute
│   ├── vite.config.js
│   ├── package.json
│   └── ...
└── server/                 # Backend (Express)
├── models/             # Customer, Campaign, CommunicationLog, Order
├── routes/             # campaignRoutes, aiRoutes, ingestionRoutes, authRoutes
├── services/           # campaignProcessor.js
├── config/             # passport-setup.js
├── index.js            # Express entrypoint
└── package.json

````

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=<your-mongodb-uri>
SESSION_SECRET=<any-random-string>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
GROQ_API_KEY=<groq-api-key>
FRONTEND_URL=https://xeno-crm-sigma.vercel.app
````

### Frontend (`client/.env.local`)

```env
VITE_API_URL=https://<your-render-backend>.onrender.com
```

---

## 🖥 Local Development

### Backend

```bash
cd server
npm install
npm run dev      # runs on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev      # runs on http://localhost:5173
```

In dev mode, Vite proxies `/api` and `/auth` to backend.

---

## 🌍 Deployment

### Backend → Render

1. Root dir: `/server`
2. Build: `npm install`
3. Start: `node index.js`
4. Env Vars: set as above.
5. Ensure `app.listen(PORT)` (not bound to 127.0.0.1).

### Frontend → Vercel

1. Root dir: `/client`
2. Build command: `npm run build`
3. Output dir: `dist`
4. Env Vars:

   ```
   VITE_API_URL=https://<your-render-backend>.onrender.com
   ```

---

## 🧪 Testing

* **Health checks**

  * `/api/ping` → `{ ok: true }`
  * `/api/campaigns/_test` → test response
* **Flow**

  1. Ingest customers/orders
  2. Create campaign with rules or AI
  3. Preview → Save
  4. Delivery simulation logs `SENT/FAILED`
  5. History page shows stats

---

## 🧠 Architecture Diagram

```
 [React Frontend] --(fetch, axios)--> [Express API] --(Mongoose)--> [MongoDB]
        |                                         |
        |------ OAuth (Google Passport) ----------|
        |------ AI Rule Gen (Groq API) -----------|
```

---

## ⚡ Known Limitations

* Delivery is **simulated**, not via real vendor APIs.
* Pub-Sub (Kafka/Redis) **not implemented**, but architecture allows extension.
* Google OAuth tested in dev, requires proper production client ID for live.
* AI integration limited to rule generation; other AI features (message suggestions, summaries) possible.

---

## 📹 Demo Video (to be attached)

Covers:

* Campaign creation
* AI rule builder
* Delivery simulation
* Campaign history

---

## ✅ Assignment Coverage Checklist

* [x] Data Ingestion APIs
* [x] Campaign Creation UI with Rule Builder
* [x] Campaign Delivery & Logging
* [x] Authentication (Google OAuth)
* [x] AI Integration (Groq rule generator)
* [x] Deployment (Render + Vercel)
* [x] README with setup + diagram + env vars

---

## 📄 License

MIT License

```

---

This README matches **every deliverable** in the assignment PDF:  
- Local setup ✅  
- Architecture diagram ✅  
- AI tools explanation ✅  
- Known limitations ✅  
- Deployment + env vars ✅  

Do you want me to also add a **“How to run demo video” script** (like a 1–2 minute narration guide), so when you record your 7-min walkthrough you hit every point cleanly?
```
