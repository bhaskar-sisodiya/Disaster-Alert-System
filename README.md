# 🌍 Disaster Alert System

A full‑stack web application built with **Express.js**, **MongoDB**, and a **Vite + React frontend**.  
It provides a secure platform for users to **register, log in, and access real‑time disaster alerts**.  
Designed with JWT authentication, responsive UI, and clean routing for a professional user experience.

---

## ✨ Features
- 🔐 **User Authentication** – Register/Login with JWT tokens
- 🛡️ **Protected Routes** – Only authenticated users can access alerts
- 📢 **Disaster Alerts** – View alerts with type, severity, and location
- 📂 **File Upload Support** – (optional) Attach images/documents when posting alerts
- 🎨 **Responsive UI** – Modern landing page with Register/Login buttons
- ⚙️ **Environment Config** – API URLs and secrets managed via `.env`
- 🌐 **CORS Enabled** – Backend configured for safe frontend communication

---

## 🛠 Tech Stack
**Frontend**
- React (Vite)
- React Router
- CSS modules

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT Authentication

**Other Tools**
- CORS middleware
- dotenv for environment variables
- GitHub for version control

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/disaster-alert-system.git
cd disaster-alert-system
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a .env file in backend/:
```bash
PORT=
MONGO_URI=
JWT_SECRET=
```


Run the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create a .env file in frontend/:
```bash
VITE_API_URL=
```

Run the frontend:
```bash
npm run dev
```
