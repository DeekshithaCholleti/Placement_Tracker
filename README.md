# Smart Placement Tracker

A full-stack web application designed to streamline and automate campus placement drives. The platform allows training and placement officers (TPOs / Admins) to manage recruitment drives, track student applications, and view analytics, while enabling students to build profiles, upload resumes, check eligibility, and apply to open positions.

## Project Architecture & Structure

The repository is organized as a monorepo consisting of two main parts:

```text
├── backend/          # Express API server with MongoDB/Mongoose
└── frontend/         # React SPA built with Vite and Tailwind CSS v4
```

### Core Features

*   **Role-Based Access Control**: Separate dashboards and features for Students and Administrators.
*   **Automated Eligibility Engine**: Dynamically checks student eligibility (GPA, active backlogs, department) against job requirements.
*   **Placement Analytics Dashboard**: Provides admins with key metrics (placement percentage, department performance, CTC ranges, and application pipeline status).
*   **Automated Email Notifications**: Integrates Nodemailer to alert eligible students when a new drive is posted, and notify them when their application status is updated.
*   **Resume Storage**: Multi-format resume uploads processed via Multer and stored securely on Cloudinary.

---

## Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose ODM)
*   **File Storage**: Cloudinary (handled via Multer & Multer-Storage-Cloudinary)
*   **Authentication**: JSON Web Tokens (JWT) stored in HTTP-Only cookies
*   **Notifications**: Nodemailer (SMTP integration)

### Frontend
*   **Framework**: React (v19)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (v4)
*   **Routing**: React Router DOM (v7)
*   **State Management**: React Context API (Auth Context)
*   **API Client**: Axios with interceptors
*   **Toast Notifications**: React Hot Toast

---

## Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a MongoDB Atlas URI)

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Placement_Tracker1
    ```

2.  **Set up the Backend**:
    See the [Backend README](file:///c:/Users/choll/OneDrive/Desktop/Placement_Tracker1/backend/README.md) for environment configuration and installation steps.

3.  **Set up the Frontend**:
    See the [Frontend README](file:///c:/Users/choll/OneDrive/Desktop/Placement_Tracker1/frontend/README.md) for running the development server and building for production.

### Running the Project Locally

To run both services concurrently during development, open two terminal windows:

*   **Terminal 1 (Backend)**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The server will run on `http://localhost:5000`.

*   **Terminal 2 (Frontend)**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The application will run on `http://localhost:5173`.
