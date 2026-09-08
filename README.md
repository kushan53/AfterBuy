# AfterBuy — Post-Purchase Management OS 🛡️📦

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

> **Never let a return window expire or a refund slip away.**  
> AfterBuy is a full-stack web application that tracks return deadlines, overdue merchant refunds, and warranty receipts in one centralized dashboard.

---

## ✨ Features

- 🛡️ **Return Sentinel:** Auto-calculates return deadlines (7-day, 10-day, 14-day) with real-time urgency alerts.
- 💰 **Refund Recovery:** Tracks packages handed to couriers and flags delayed or missing merchant refunds.
- 📑 **Warranty & Invoice Vault:** Securely organizes purchase proofs and warranty expiration dates.
- 🚀 **Interactive Resolution Pipeline:** Visual conveyor track demonstrating package lifecycle from delivery to bank settlement.
- 🔐 **Authentication:** JWT-based email/password login + Google OAuth 2.0 with persistent session support.
- 🌓 **Dark & Light Mode:** Tailored design system with keyboard shortcut navigation (`Ctrl+K` / `⌘K`).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS, Lucide Icons, React Router v7
- **Backend:** Node.js, Express.js, JWT, Bcrypt
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** Custom JWT Bearer Auth + Google Identity Services (GIS)

---

## 🚀 Quickstart (Run Locally)

### 1. Clone the repository
```bash
git clone https://github.com/kushan53/AfterBuy.git
cd AfterBuy
```

### 2. Setup Backend (`server/`)
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
# Running on http://localhost:5000
```

### 3. Setup Frontend (`client/`)
In a **new terminal**:
```bash
cd client
npm install
```

Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Start the frontend:
```bash
npm run dev
# Running on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
AfterBuy/
├── client/                     # React 19 Frontend
│   ├── src/
│   │   ├── components/         # Auth, layout, UI design system, marketing
│   │   ├── context/            # AuthContext, PurchaseContext, ThemeContext
│   │   ├── pages/              # Dashboard, Purchases, Returns, Refunds, Settings
│   │   └── utils/              # api.js, cn.js
│   └── vite.config.js
│
├── server/                     # Express REST API
│   ├── config/                 # db.js (MongoDB Atlas connection)
│   ├── controllers/            # authController, purchaseController
│   ├── models/                 # User.js, Purchase.js
│   ├── routes/                 # authRoutes, purchaseRoutes
│   └── server.js
│
├── .gitignore                  # Protects sensitive .env files
└── README.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
