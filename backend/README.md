# Smart Placement Tracker - Backend

This is the Express API server that powers the Smart Placement Tracker. It handles authentication, data management, resume uploads, automatic eligibility checking, and email notifications.

## Tech Stack

*   **Node.js & Express**: Core server and API routing.
*   **MongoDB & Mongoose**: NoSQL database and schema modeling.
*   **JSON Web Tokens (JWT)**: Secure user session management.
*   **Multer & Cloudinary**: Middleware to handle multipart form-data (resumes) and upload them directly to Cloudinary.
*   **Nodemailer**: SMTP email transport for real-time notifications.

---

## Folder Structure

```text
├── APIs/                  # Express route declarations (auth, admin, company, application)
├── config/                # Database connections and environment setups
├── controllers/           # Business logic handling incoming requests
├── middleware/            # JWT verification and role authentication checks
├── models/                # Mongoose schemas (User, Company, Application)
├── utils/                 # Utility helpers (eligibility check logic, email templates)
├── uploads/               # Local temp folder for file handling (if applicable)
├── server.js              # Entry point of the Express application
└── .env                   # Configuration file (ignored by Git)
```

---

## Configuration (`.env`)

Create a `.env` file in the root of the `backend` directory. Here is the configuration template:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/placement_tracker
JWT_SECRET=your_jwt_secret_key

# Cloudinary credentials for resume storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMTP Email details for nodemailer
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

---

## Key API Endpoints

### 1. Authentication (`/api/auth`)
*   `POST /api/auth/register` - Create a student/admin account.
*   `POST /api/auth/login` - Authenticate user and issue JWT cookie.
*   `POST /api/auth/logout` - Clear the auth cookie.
*   `GET /api/auth/me` - Get profile details of the current logged-in user.
*   `PUT /api/auth/update-profile` - Update student profile fields (GPA, backlogs, branch) and upload a new resume.

### 2. Company & Placement Drives (`/api/company`)
*   `POST /api/company/add` - (Admin only) Create a new placement drive. Automatically sends emails to eligible candidates.
*   `GET /api/company/all` - Get all placement drives with applicant statistics.
*   `PUT /api/company/update/:id` - (Admin only) Modify placement drive details.
*   `DELETE /api/company/delete/:id` - (Admin only) Remove a placement drive.

### 3. Applications (`/api/application`)
*   `POST /api/application/apply/:companyId` - (Student only) Submit application for a company. Performs check-eligibility and deadline verification.
*   `GET /api/application/my` - (Student only) View all jobs applied by the current student.
*   `GET /api/application/applicants/:companyId` - (Admin/TPO only) List all students who applied to a specific company drive.
*   `PUT /api/application/status/:applicationId` - (Admin only) Move candidate to next round or update application status (e.g., Selected, Rejected, HR Round). Sends real-time email notification.

### 4. Admin Dashboard Analytics (`/api/admin`)
*   `GET /api/admin/stats` - Fetch core metrics including placement rates, average/highest CTC, department-wise summaries, and CTC distribution ranges.
*   `GET /api/admin/applications` - Get the complete list of student applications.
*   `GET /api/admin/selected` - Retrieve all selected candidates.

---

## Installation & Run

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server (uses `nodemon` for auto-reloading):
    ```bash
    npm run dev
    ```
4.  For production:
    ```bash
    npm start
    ```
