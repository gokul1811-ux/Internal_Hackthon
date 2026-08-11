# Smart Patient Queue & Medicine Reminder System

> **Healthcare SaaS Platform with AI-Based Symptom Recognition & Smart Queue Prioritization**
> Developed for Live Interactive Hackathon Demonstration.

---

## 🏥 Problem Statement
Traditional hospital waiting rooms suffer from long, unpredictable queues, severe crowding, and inefficient triage. Patients with urgent medical symptoms are often forced to wait in the same sequential order as routine checkups. Furthermore, post-consultation patients frequently struggle with prescription adherence and pill schedules.

## 💡 Solution
**SmartCare** is a unified healthcare SaaS application that digitally manages hospital appointments and patient queues while assisting patients with medicine adherence. 

Key features include:
1. **AI-Based Symptom Recognition & Priority Triage**: Analyzes patient symptom descriptions in real time to suggest urgency categories (`High`, `Moderate`, `Low`) and queue priorities (`Urgent Review`, `Priority`, `Normal`).
2. **Medical Safety Guardrail**: The AI engine provides preliminary triage suggestions ONLY. It explicitly does NOT diagnose diseases, and final queue priorities MUST be reviewed and confirmed by authorized medical staff.
3. **Smart Queue System**: Generates unique tokens (e.g. `CARD-001`, `GEN-024`), calculates patients ahead, estimated wait time countdowns, and supports live status progression (`Waiting` → `Called` → `In Consultation` → `Completed`).
4. **Patient Dashboard & Pill Tracker**: Real-time queue tracker, medicine schedule checklist, mark taken/skip actions, and appointment history.
5. **Doctor Command Center**: Complete live queue table, AI symptom analysis review, priority confirmation override controls, "Call Next Patient" action, and consultation diagnosis/prescription notes dialog.
6. **Multilingual Architecture**: Instant UI language toggle supporting English and Tamil (தமிழ்).

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Lucide Icons, CSS Modules & Modern Healthcare SaaS Design Tokens.
- **Backend**: Node.js, Express.js REST API Server.
- **Database**: SQLite / JSON Storage Layer with zero native compilation dependencies.
- **Authentication**: JWT-based session tokens with role-based access control (`patient` vs `doctor`).
- **AI Triage**: Isolated Rule-based Natural Language Symptom Analysis Service.

---

## 🔑 Live Demo Credentials

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Doctor** | `doctor@smartcare.demo` | `password123` | Doctor Dashboard, AI priority review, Call next patient, Prescription notes |
| **Patient** | `patient@smartcare.demo` | `password123` | Patient Dashboard, Book appointment with AI preview, Token tracker, Pill reminders |

---

## 🚀 Quick Start / How to Run Locally

### 1. Install All Dependencies
Run from the root directory:
```bash
npm run install:all
```
*(This installs root, server, and client package dependencies)*

### 2. Start Both Server & Client Concurrently
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 📡 REST API Documentation

### Authentication API
- `POST /api/auth/register` — Register a new patient account
- `POST /api/auth/login` — Sign in as Doctor or Patient
- `GET /api/auth/me` — Verify active JWT session

### Symptom Triage API
- `POST /api/symptom-analysis`
  - **Input**: `{ "symptoms": "I have severe chest discomfort and difficulty breathing" }`
  - **Output**: `{ "keywords": ["chest discomfort", "difficulty breathing"], "category": "Cardiac", "urgency": "High", "suggestedPriority": "Urgent Review", "reason": "...", "disclaimer": "AI triage suggestion only — final priority must be confirmed by medical staff." }`

### Appointments & Queue API
- `POST /api/appointments` — Book appointment, run AI triage, generate queue token
- `GET /api/appointments` — List appointments for user/doctor
- `GET /api/queue` — Fetch doctor live queue list
- `GET /api/queue/status` — Patient live token status
- `POST /api/queue/:id/confirm-priority` — Doctor confirms or overrides queue priority
- `POST /api/queue/:id/call` — Call patient into consultation room
- `POST /api/queue/:id/complete` — Mark consultation completed and add doctor notes

### Medicine Reminders API
- `GET /api/medicine-reminders` — Get today's pill reminders
- `POST /api/medicine-reminders` — Create new medicine reminder
- `PUT /api/medicine-reminders/:id` — Mark as Taken / Skipped / Update details
- `DELETE /api/medicine-reminders/:id` — Delete reminder

---

## 📂 Project Architecture

```
HACKTHON/
├── package.json                   # Root concurrently script runner
├── README.md                      # Documentation & demo guide
├── server/
│   ├── index.js                   # Express server entry point
│   ├── db.js                      # Database schema & demo seed data initializer
│   ├── services/
│   │   └── symptomAI.js           # Isolated AI Symptom Triage Engine
│   ├── routes/
│   │   ├── auth.js                # Login & Registration endpoints
│   │   ├── appointments.js        # Booking & Token generation
│   │   ├── queue.js               # Queue management & Doctor actions
│   │   ├── symptoms.js            # AI Triage endpoint
│   │   ├── medicine.js            # Pill reminders CRUD
│   │   ├── analytics.js           # Doctor dashboard stats
│   │   └── doctors.js             # Doctor & Department listings
│   └── package.json
└── client/
    ├── index.html
    ├── vite.config.js             # Vite config with API proxy
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx                # Router & Provider wrapper
    │   ├── index.css              # Modern SaaS design system
    │   ├── context/
    │   │   ├── AuthContext.jsx    # Session state & JWT handling
    │   │   └── LanguageContext.jsx# i18n English/Tamil context
    │   ├── components/
    │   │   ├── Navbar.jsx         # Navigation header & language selector
    │   │   ├── Footer.jsx
    │   │   ├── TokenBadge.jsx     # Visual token card component
    │   │   ├── QueueVisualizer.jsx# Progress step visualizer
    │   │   ├── AISymptomCard.jsx  # AI Triage result & disclaimer badge
    │   │   ├── MedicineReminderCard.jsx # Pill checklist card
    │   │   └── AnalyticsCharts.jsx# Doctor priority breakdown charts
    │   └── pages/
    │       ├── LandingPage.jsx    # Hero, features & workflow
    │       ├── AuthPages.jsx      # Patient & Doctor login/register
    │       ├── PatientDashboard.jsx# Patient token & pill hub
    │       ├── BookAppointmentPage.jsx # Booking & Live AI preview
    │       ├── QueueTrackPage.jsx # Real-time queue position countdown
    │       ├── DoctorDashboard.jsx# Clinical queue command center
    │       └── MedicineRemindersPage.jsx # Full prescription manager
    └── package.json
```

---

## 🎬 Step-by-Step Hackathon Live Demo Flow

1. **Open Application**: Navigate to `http://localhost:3000`.
2. **Landing Page**: View the hero section, features, workflow, and demo credentials.
3. **Patient Experience**:
   - Click **"Patient Login"** and sign in using `patient@smartcare.demo` / `password123`.
   - Click **"Book Appointment"**.
   - Select Department (`Cardiology`) and Doctor (`Dr. Priya Sharma`).
   - Type symptoms: *"I have severe chest discomfort and difficulty breathing"*.
   - Watch the **AI Symptom Analysis Preview** automatically detect keywords (`chest discomfort`, `breathing`), suggest Category `Cardiac`, Urgency `High`, and Priority `Urgent Review`.
   - Click **"Confirm Booking & Generate Queue Token"** → Receive digital token `CARD-001`.
   - View **Patient Dashboard** showing token card, patients ahead, estimated wait time, and today's pill reminders.
4. **Doctor Experience**:
   - Click **Logout** / Switch to **Doctor Portal** login using `doctor@smartcare.demo` / `password123`.
   - On the **Doctor Dashboard**, observe today's metrics, analytics charts, and the live queue table.
   - Locate patient token `CARD-001` with AI suggested priority `Urgent Review`.
   - Click **"Review / Confirm Priority"** dropdown to confirm `Urgent Review`.
   - Click **"Call Next Patient (CARD-001)"** → Queue status updates to `In Consultation`.
   - Click **"Complete"** → Enter prescription notes and finalize consultation.
5. **Medicine Reminder Flow**:
   - Log back in as Patient → Mark Paracetamol dose as **"Taken"**.
   - Switch language selector to **Tamil (தமிழ்)** → Observe instant translation of all UI text.
