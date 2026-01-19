# Trackr: Construction Project Management System

Trackr is a full-stack application designed to streamline construction site management, task assignment, and progress verification.

## Tech Stack

*   **Frontend:** React (Vite), Redux Toolkit, Tailwind CSS, Framer Motion
*   **Backend:** Node.js (Express.js), MongoDB (Mongoose)
*   **Authentication:** JWT, bcryptjs

## Getting Started

### 1. Installation

Navigate to both the `backend` and `frontend` directories and install dependencies:

```bash
# In backend/
npm install

# In frontend/
npm install
```

### 2. Configuration (Sensitive Information)

**Crucially, you must configure your environment variables.**

Create a file named `.env` inside the `backend/` directory and populate it with your sensitive credentials. This file is ignored by Git to protect your secrets.

**Required Backend Variables:**

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `MONGO_URI` | Connection string for your MongoDB database. | `mongodb+srv://user:pass@cluster.xyz/trackr` |
| `JWT_SECRET` | Secret key for signing JWTs. | `a_very_long_and_random_secret_key` |
| `ADMIN_JOIN_CODE` | Secret code allowing a user to register as an admin. | `SITE_ADMIN_2024` |
| `FRONT_END_URL` | URL of the frontend application. | `http://localhost:5173` |
| `EMAIL_SERVICE_HOST` | SMTP host (e.g., `smtp.gmail.com`). | `smtp.gmail.com` |
| `EMAIL_SERVICE_PORT` | SMTP port (e.g., `587`). | `587` |
| `EMAIL_SERVICE_USER` | Email address used for sending password reset links. | `your_email@example.com` |
| `EMAIL_SERVICE_PASS` | App password or key for the email service. | `your_app_password` |

### 3. Running the Application

Start the backend server:

```bash
# In backend/
npm run dev
```

Start the frontend application:

```bash
# In frontend/
npm run dev
```

The application should now be accessible at `http://localhost:5173`.
