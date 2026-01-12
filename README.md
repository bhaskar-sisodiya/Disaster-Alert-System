# 🌍 Disaster Alert System

A full-stack web application built with **Express.js**, **MongoDB**, and a **Vite + React frontend**.  
It provides a secure platform for users to **register, log in, manage profiles, create AI-based disaster alerts, and view analytics**.

The system detects disasters from uploaded images using **Gemini AI**, stores alert images in **Supabase Storage**, and sends **email notifications** to users living in the affected location.

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ User Registration & Login with **JWT authentication**
- ✅ **Protected Routes** (only logged-in users can access dashboard features)
- ✅ Role support: **Admin / User**
- ✅ Admin-only permissions (example: delete alerts)

### 👤 Profile Module
- ✅ Profile page (view + edit mode)
- ✅ Update: username, phone, gender, location
- ✅ Avatar selection system (predefined avatars)
- ✅ Admin/User heading shown based on role (non-editable)

### 🚨 Disaster Alerts Module
- ✅ Create alert by uploading an image + location
- ✅ AI detection using **Gemini API**
- ✅ Stores alert image in **Supabase Storage**
- ✅ Alerts contain: type, severity, confidence, reason, location, timestamp, image
- ✅ Active Alerts: shows alerts created within **last 24 hours**
- ✅ Alert History page: paginated list of all alerts (latest → oldest)
- ✅ Admin-only: delete alert

### 📩 Email Notification System
- ✅ Sends email notifications when a disaster alert is created
- ✅ Only sends emails for alerts where type ≠ **"Not a Disaster"**
- ✅ Notifies users whose profile location matches alert location
- ✅ Email includes: alert summary + website link + image preview
- ✅ Website URL configurable via backend env (`CLIENT_URL`)

### 📞 Emergency Numbers Module
- ✅ Emergency categories list
- ✅ Fetch emergency numbers by category from backend
- ✅ Empty-state UI if no numbers exist
- ✅ Ability to add emergency numbers via form

### 📊 Analytics Module
- ✅ Dedicated Analytics dashboard
- ✅ Graph selection via analytics cards (2-column grid)
- ✅ Mix of graphs (Line + Bar + Pie/Donut)
- ✅ Confidence graph visible only for Admin (optional)
- ✅ Minimal server load using caching approach (React Query)

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Recharts (Analytics graphs)
- @tanstack/react-query (caching + minimal server load)
- CSS (custom UI styling)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (image upload)
- Nodemailer (email alerts)
- Gemini AI integration (disaster detection)
- Supabase Storage (alert images)

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

# Gemini AI
GEMINI_API_KEY=

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=

# Email alerts
EMAIL_USER=
EMAIL_PASS=

# Frontend URL
CLIENT_URL=http://localhost:5173
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
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```
