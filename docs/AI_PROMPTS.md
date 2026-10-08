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
