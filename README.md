
# Trackr: Construction Project Management System

Trackr is a robust, full-stack project management platform tailored for the construction industry. It streamlines task assignment, workforce management, progress tracking, and real-time collaboration across multiple workspaces.

## Key Features

*   **Multi-Workspace Architecture**: Seamlessly switch between different project environments with isolated data and roles.
*   **Role-Based Access Control (RBAC)**: secure hierarchy with distinct permissions for Owners, Admins, Managers, and Members.
*   **Task Management**: Create, assign, and track tasks with priorities, due dates, checklists, and attachments.
*   **Real-Time Collaboration**:
    *   **Live Chat**: Private messaging and workspace-wide group chats powered by Socket.io.
    *   **Notifications**: Instant updates on task assignments and messages.
*   **Performance & Scalability**:
    *   **Redis Caching**: Read-through caching for high-frequency data (dashboards, task lists) to reduce DB load.
    *   **BullMQ Background Jobs**: Asynchronous processing for heavy tasks like activity logging and report generation.
    *   **Rate Limiting**: Layered protection against API abuse and spam.
*   **Workforce Management**: Track attendance, manage leaves, and view member profiles.

## 🛠️ Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose Schema Design)
*   **Caching**: Redis (v5+)
*   **Queue System**: BullMQ
*   **Real-time Engine**: Socket.io
*   **Authentication**: JWT (JSON Web Tokens) & bcryptjs

### Frontend
*   **Framework**: React (Vite)
*   **State Management**: Redux Toolkit
*   **Styling**: Tailwind CSS
*   **Animations**: Framer Motion
*   **HTTP Client**: Axios

## ⚙️ Installation & Setup

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Redis (Local or Cloud)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/trackr.git
cd trackr
```

### 3. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/trackr
JWT_SECRET=your_super_secret_key
FRONT_END_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
ADMIN_JOIN_CODE=SECRET_ADMIN_CODE
```

Start the server:
```bash
npm run dev
# Server runs on port 4000
```

Start the background worker (in a separate terminal):
```bash
npm run worker
# Processes async jobs like activity logging
```

### 4. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the development server:
```bash
npm run dev
# App runs on http://localhost:5173
```

## 🏗️ Architecture Highlights

### Caching Strategy
Trackr uses a **Read-Through** caching strategy to optimize performance:
*   **Key Namespacing**: Keys are versioned (e.g., `v1:workspace:{id}:summary`) to avoid collisions.
*   **Failover Protection**: If Redis is offline, the system automatically falls back to MongoDB without crashing.
*   **Smart Invalidation**: Cache entries are automatically cleared or updated when related data is modified (e.g., creating a task invalidates the workspace task list).

### Background Processing
Heavy write operations are decoupled from the main request/response cycle using **BullMQ**:
*   **Activity Logging**: When a user performs an action (e.g., "Created Task"), a job is pushed to the `activity-log` queue.
*   **Reliability**: The worker process picks up the job and writes it to MongoDB, ensuring API response times remain fast.

### Security
*   **Rate Limiting**:
    *   Global Limit: 500 requests/15m
    *   Auth Protection: 10 requests/15m (prevent brute force)
    *   Chat Spam: 100 messages/10m
*   **Data Isolation**: Middleware ensures users can only access data within their assigned workspaces.

## 🤝 Contributing
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
