# MediCare Hub — Clinic & Appointment Management System

A modern, responsive, frontend-only clinic management portal built with **React 19** and **Vanilla CSS**. Developed with AI assistance paired with rigorous human code review, refactoring, and accessibility enhancements.

---

## 🌟 Key Features

- **Clinic Dashboard**: High-level key performance metrics (total appointments, pending triage, active specialists, registered patients), live appointment schedule, and on-duty doctors roster.
- **Appointment Management**:
  - Filter appointments by status tabs (`All`, `Confirmed`, `Pending`, `Completed`, `Cancelled`).
  - Search by patient name, attending doctor, booking ID, or clinical reason.
  - Filter by clinical specialty and specific appointment date.
  - Multi-criteria sorting (by date, doctor name, patient name, and consultation fee).
  - Lifecycle actions: confirm pending bookings, complete consultations, reschedule date/time slots, and cancel bookings with safeguard confirmations.
- **Specialist Directory**: Comprehensive doctor profiles with specialties, clinical experience, patient ratings, consultation fees, and available days/time slots.
- **Patient Directory**: Patient profiles detailing emergency contacts, medical history, known drug allergies, and past visits.
- **Interactive Booking Dialog**:
  - Supports scheduling for existing patients or quick on-the-fly patient registration.
  - **Slot Collision Detection**: Automatically prevents booking time slots that are already reserved for that specialist.
  - **Full Form Accessibility**: Screen reader accessible error messages using ARIA attributes (`aria-invalid`, `aria-describedby`, `role="alert"`).
  - Validation preventing past-date scheduling or empty mandatory fields.
- **Client-Side State Persistence**: All appointment updates, creations, and status modifications persist automatically in `localStorage`.
- **Demo Reset & Data Sync**: Accessible "Reset Demo" button in the top navigation to quickly restore original mock data, and a "Sync Data" button to simulate network delays.

---

## 📁 Project Architecture

```
FR-a-3-ReactA/
├── docs/
│   ├── AI_PROMPTS.md              # Complete log of prompts, purposes, and review decisions
│   └── AI_ASSISTANCE.md           # Report on AI usage, human oversight, and refactored areas
├── public/                        # Static assets and favicons
├── src/
│   ├── components/
│   │   ├── appointments/          # Appointment modals (Booking, Reschedule, Details, Cancel)
│   │   ├── common/                # Shared UI (Modal, StatsCard, StatusBadge, Toast)
│   │   ├── doctors/               # DoctorDetailModal
│   │   └── patients/              # PatientDetailModal
│   ├── data/
│   │   └── mockData.js            # Realistic clinical mock datasets
│   ├── hooks/
│   │   ├── useAppointments.js     # State hook with localStorage synchronization
│   │   └── useAppointmentFilter.js# Decoupled filtering, search, and sorting logic
│   ├── layouts/
│   │   ├── MainLayout.jsx         # App shell coordinating Sidebar and Navbar
│   │   ├── Navbar.jsx             # Top bar with global search & Demo Reset
│   │   └── Sidebar.jsx            # Responsive navigation drawer
│   ├── pages/
│   │   ├── AppointmentsPage.jsx   # Appointments schedule table & filter bar
│   │   ├── DashboardPage.jsx      # Clinic KPIs & recent appointments overview
│   │   ├── DoctorsPage.jsx        # Specialists directory with booking shortcuts
│   │   └── PatientsPage.jsx       # Patient medical records directory
│   ├── utils/
│   │   └── formatters.js          # Date, currency, and ID formatting helpers
│   ├── App.jsx                    # Root view controller
│   ├── index.css                  # Pure Vanilla CSS design system
│   └── main.jsx                   # Entry point
├── index.html                     # HTML head with Plus Jakarta Sans & Inter fonts
├── package.json                   # Dependencies and scripts
└── vite.config.js                 # Vite build configuration
```

---

## 🛠️ Tech Stack & Practices

- **React 19**: Modern functional components, custom hooks, `useMemo`, `useCallback`, `useId`.
- **Vite 8**: Ultra-fast ESM development and production bundling.
- **Vanilla CSS**: Custom CSS variables design tokens (spacing, color palettes, shadows, modal animations, responsive breakpoints) with no third-party CSS framework overhead.
- **Lucide React**: Clean, accessible clinical iconography.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher; tested on v22.14.0)
- npm (v9 or higher)

### Installation & Run

1. Clone or navigate to the repository directory:
   ```bash
   cd FR-a-3-ReactA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview the production build:
   ```bash
   npm run preview
   ```

---

## 📝 Assignment Documentation
- Prompts Log: [docs/AI_PROMPTS.md](docs/AI_PROMPTS.md)
- AI Assistance & Refactoring Report: [docs/AI_ASSISTANCE.md](docs/AI_ASSISTANCE.md)
