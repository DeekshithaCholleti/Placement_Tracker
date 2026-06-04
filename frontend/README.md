# Smart Placement Tracker - Frontend

The frontend interface for the Smart Placement Tracker is a Single Page Application (SPA) built using React, styled with Tailwind CSS v4, and bundled with Vite.

## Tech Stack & Features

*   **React (v19)**: User interface development.
*   **Vite**: Fast bundling and Hot Module Replacement (HMR).
*   **Tailwind CSS (v4)**: Modern utility-first styling.
*   **React Router DOM (v7)**: Navigation, route guards (guest, student, and admin routes).
*   **Axios**: API communication with global handlers.
*   **React Hot Toast**: Real-time notifications and action feedbacks.

---

## Folder Structure

```text
├── src/
│   ├── api/          # Axios config and global API request setup
│   ├── assets/       # Static assets, logos, and illustrations
│   ├── components/   # Reusable UI components (e.g., Loader, dynamic inputs)
│   ├── context/      # React Contexts (AuthContext for user states)
│   ├── layouts/      # Global layouts (Sidebar, Navbar, main wrapper)
│   ├── pages/        # Route views split into roles:
│   │   ├── Admin/    # Dashboard stats, Student profiles, Job Drives
│   │   ├── Auth/     # Login & Signup pages
│   │   └── Student/  # Student dashboard, Profile builder, Job list, Application tracking
│   ├── routes/       # Path definitions and router configurations
│   ├── App.css       # Core layout styles
│   ├── index.css     # Global styles and Tailwind imports
│   ├── App.jsx       # Routing wrapper and context providers
│   └── main.jsx      # Vite mount entrypoint
├── index.html        # App wrapper
├── vite.config.js    # Vite configurations
└── eslint.config.js  # Code linting settings
```

---

## Key Views & Workflows

### 1. Authentication (Student / Admin)
*   Clean login and registration flows.
*   Persistent sessions using cookies validated on initial load.

### 2. Student Dashboard
*   **Profile**: Manage personal, contact, and academic details (CGPA, active backlogs, department) and upload resume.
*   **Job Openings**: Browse active campus recruitment drives. Jobs show detailed description, eligibility criteria, CTC, and deadlines.
*   **Automatic Eligibility Badge**: Instantly shows if the student is eligible to apply or explains why they aren't (e.g. CGPA too low, backlogs outstanding).
*   **Applications Tracker**: A chronological timeline to view statuses like `Applied`, `Round 1`, `Round 2`, `HR Interview`, and final decision (`Selected` / `Rejected`).

### 3. Administrator / TPO Dashboard
*   **Interactive Analytics**: Graphical cards highlighting overall metrics (placement rate, top-performing branches, CTC distributions, recruiter details).
*   **Drives Management**: Create, edit, and delete recruitment drives. Setting CGPA cutoffs triggers emails to qualifying students.
*   **Student Directory**: View and search all registered students, download resumes, and verify academic records.
*   **Application Pipeline**: Move students through various interview stages and mark selections.

---

## Installation & Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Configure API Endpoint:
    By default, Axios is configured to communicate with the backend at `http://localhost:5000/api`. If your backend is hosted elsewhere, check `/src/api` configuration.
4.  Run the development server:
    ```bash
    npm run dev
    ```
    The site will open locally at `http://localhost:5173`.
5.  Build the production bundle:
    ```bash
    npm run build
    ```
