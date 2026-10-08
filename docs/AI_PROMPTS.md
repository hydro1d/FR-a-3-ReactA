# AI Prompts Log

This document records the prompts used during the development of **MediCare Hub**, along with their purpose, the AI's output, and the developer's review decisions.

---

### Prompt 1: Project Initialization & Scope Definition

**Prompt:**
> You are helping me build a separate React frontend project for an assignment. Repository: hydro1d/FR-a-3-ReactA. This is a FRONTEND-ONLY project. Inspect the repository, determine current setup, and propose an implementation for MediCare Hub (Clinic & Appointment Management Portal). Follow staged phases and document AI interactions.

**Purpose:**
Analyze repository status, verify tools and runtime environment, initialize a clean modern React frontend scaffolding, and align on the application domain ("MediCare Hub").

**Result:**
- Inspected the repository and detected an empty Git repository.
- Scaffolding initialized using Vite with React 19.
- Added `lucide-react` for clean, accessible clinic iconography.
- Outlined a 7-phase implementation roadmap adhering to functional React practices and Vanilla CSS styling.

**My Review:**
- Accepted Vite + React 19 as the build environment for fast HMR and standards compliance.
- Confirmed the "MediCare Hub" domain to build a realistic clinic scheduling portal.
- Insisted on maintaining pure Vanilla CSS with CSS variables rather than heavyweight CSS frameworks to ensure full control over responsive design and aesthetics.
- Approved staged progression with Git commits for each development milestone.

---

### Prompt 2: Design System, Layout Structure & Core State Architecture

**Prompt:**
> Build the core application structure for MediCare Hub: design system in pure Vanilla CSS (CSS variables, responsive shell, typography, cards, badges, modal), mock datasets (doctors, patients, appointments, specialties), utility formatters, responsive Sidebar and Navbar layouts, and custom hook `useAppointments` with localStorage persistence.

**Purpose:**
Establish the foundation of the frontend without jumping straight into haphazard UI coding. Ensure modular directory layout (`src/layouts`, `src/components/common`, `src/hooks`, `src/utils`, `src/data`).

**Result:**
- Created complete Vanilla CSS tokens and styles in `src/index.css`.
- Created structured clinical datasets in `src/data/mockData.js`.
- Implemented responsive `Sidebar` with mobile drawer backdrop and `Navbar` with search.
- Created reusable components `StatusBadge`, `StatsCard`, `Modal`, `Toast`.
- Created `useAppointments` custom hook providing state, localStorage caching, and simulated network delays.

**My Review:**
- Verified that no external CSS UI library (such as Tailwind or Bootstrap) was introduced, maintaining pure Vanilla CSS control.
- Confirmed responsive breakpoint handling for tablets and phones (sidebar slides into off-canvas drawer).
- Ensured state hooks store pure serializable data in `localStorage` with fallback to default mock records.

---

### Prompt 3: Core UI Implementation & Interactive Functionality

**Prompt:**
> Implement the main clinic pages (`DashboardPage`, `AppointmentsPage`, `DoctorsPage`, `PatientsPage`) and modal workflows (`BookingModal`, `RescheduleModal`, `AppointmentDetailModal`, `DoctorDetailModal`, `PatientDetailModal`) with dynamic search, status tabs, date/specialty filtering, sorting, and user interaction toasts.

**Purpose:**
Deliver full interactive application pages and modal workflows with client-side state management, search filtering, and clinical actions (booking, rescheduling, status toggling, cancellations).

**Result:**
- Created `DashboardPage` with KPI summary cards, upcoming appointment queue, and doctor roster.
- Created `AppointmentsPage` with multi-criteria filtering (status tab, specialty, date, keyword) and sorting.
- Created `DoctorsPage` and `PatientsPage` with specialized directories and direct booking triggers.
- Built interactive modal workflows for booking, rescheduling, and inspecting appointments and patient medical histories.
- Integrated toast notification feedback system.

**My Review:**
- Verified that all actions (booking, rescheduling, cancelling, status changing) immediately update state and persist to `localStorage`.
- Verified error feedback on invalid or missing form fields in `BookingModal`.
- Checked responsive table behavior and mobile menu drawer behavior.

---

### Prompt 4: UI/UX Refinement & Responsive Polish

**Prompt:**
> Refine the application UI/UX: add quick demo reset capability to the top navbar, integrate accessible confirmation prompts before irreversible actions (such as appointment cancellation), add status pill micro-animations, and synchronize global search in the top navbar with the appointments table.

**Purpose:**
Address visual polish and edge-case user experience gaps identified during testing to make the system feel production-grade rather than a prototype.

**Result:**
- Added `CancelConfirmModal` to prevent accidental cancellations.
- Added "Reset Demo" button in `Navbar` allowing evaluators to return to initial mock state.
- Connected global search directly to appointments view with auto-routing on search entry.
- Enhanced pulse animations and hover card micro-interactions.

**My Review:**
- Accepted the cancellation safeguard modal; irreversible data changes should always require user confirmation.
- Confirmed that search typing smoothly transitions from Dashboard to Appointments view.

---

### Prompt 5: Code Review & Manual Refactoring (3 Target Areas)

**Prompt:**
> Perform a critical code audit and refactor three core areas: (1) Extract inline filtering/sorting into a reusable custom hook `useAppointmentFilter`, (2) Hardened `BookingModal` validation by preventing double-booking of doctor time slots and adding ARIA accessibility attributes, and (3) Decouple global search query state and synchronize with table filters.

**Purpose:**
Refactor initial AI-generated monolithic components into clean, testable, and accessible patterns that demonstrate conscious engineering decisions.

**Result:**
- Created `src/hooks/useAppointmentFilter.js` isolating multi-criteria filtering, sorting, and tab counts.
- Updated `BookingModal.jsx` with slot collision detection (`isSlotOccupied`) and ARIA accessibility labels (`aria-invalid`, `aria-describedby`, accessible form errors).
- Cleaned up `AppointmentsPage.jsx` by delegating state logic to the new custom hook.

**My Review:**
- Verified that collision detection stops duplicate slot bookings for the same specialist on the same date.
- Confirmed screen reader accessibility attributes are present on every input and error message.
- Validated that the code is structured cleanly and easily explainable in an assessment interview.

---
