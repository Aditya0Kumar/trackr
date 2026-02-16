
# Trackr: Multi-Tenant Project Management System

Trackr is a robust, full-stack multi-tenant project management system. It streamlines task assignment, workforce management, progress tracking, and real-time collaboration across multiple workspaces.

### Multi-Workspace Architecture
*   **Data Isolation**: Every workspace functions as an independent environment with its own members, projects, and tasks, ensuring complete data separation.
*   **Seamless Context Switching**: Users can belong to multiple workspaces and switch between them instantly without re-authentication.
*   **Invitation System**: Workspaces support member onboarding via unique invite links or admin-generated join codes.

### Role-Based Access Control (RBAC)
A strict hierarchical permission system ensures data security:
*   **Owner**: Full control over workspace settings, billing, and deletion.
*   **Admin**: Manages members, roles, and workspace configurations.
*   **Manager**: Oversees projects, assigns tasks, and views team performance.
*   **Member**: Focuses on assigned tasks, personal dashboard, and chat; restricted from administrative actions.

### Advanced Task Management
*   **Kanban-Style Statuses**: Tasks move through a defined lifecycle (Pending -> In Progress -> Awaiting Verification -> Completed).
*   **Granular Tracking**: Break down complex tasks with sub-checklists and track completion percentages.
*   **Rich Context**: Tasks support file attachments (images/docs), priority levels (High/Medium/Low), and due date tracking.
*   **Activity History**: Every action (creation, status change, comment) is logged for full auditability.

### Real-Time Collaboration
Powered by Socket.io for instant updates:
*   **Live Messaging**: Supports 1:1 Direct Messages and Workspace-wide Group Chats.
*   **Interactive Features**: See who is online, typing indicators, and read receipts in real-time.
*   **Instant Notifications**: Get alerted immediately when you are assigned a task or receive a message.

### Performance & Scalability
Engineered for speed and reliability:
*   **Redis Caching**: Implements a "Read-Through" strategy for dashboards and task lists, reducing database load by serving cached data for frequent requests (TTL: 30-60s).
*   **BullMQ Background Jobs**: Offloads heavy write operations (like Activity Logging and Email Notifications) to an asynchronous worker queue, keeping API response times fast.
*   **Rate Limiting**: Protects the API with layered limits—stricter controls for Authentication (10 req/15m) and Chat (100 msg/10m) to prevent abuse.

### Workforce Management
*   **Attendance Tracking**: Members can mark daily attendance (Present/Absent/Leave).
*   **Rectification System**: Allows members to correct past attendance records, subject to a strict monthly limit to prevent gamification.
*   **User Profiles**: Comprehensive profiles showcasing role, contact info, and activity history.

## Tech Stack

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

## Installation & Setup

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
