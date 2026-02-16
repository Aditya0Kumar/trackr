import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import ManageTasks from "./pages/admin/ManageTasks";
import ManageUsers from "./pages/admin/ManageUsers";
import CreateTask from "./pages/admin/CreateTask";
import PrivateRoute from "./routes/PrivateRoute";
import UserDashboard from "./pages/user/UserDashboard";
import TaskDetails from "./pages/user/TaskDetails";
import MyTasks from "./pages/user/MyTasks";
import Profile from "./pages/Profile";
import ManageAttendance from "./pages/admin/ManageAttendance"; // Import Admin Attendance
import MyAttendance from "./pages/user/MyAttendance"; // Import User Attendance
import Landing from "./pages/Landing"; // Import Landing Page
import ForgotPassword from "./pages/auth/ForgotPassword"; // Import ForgotPassword
import WorkspaceSelect from "./pages/workspace/WorkspaceSelect";
import CreateWorkspace from "./pages/workspace/CreateWorkspace";
import JoinWorkspace from "./pages/workspace/JoinWorkspace";
import WorkspaceSettings from "./pages/workspace/WorkspaceSettings";
import ResetPassword from "./pages/auth/ResetPassword"; // Import ResetPassword
import Calendar from "./pages/Calendar"; // Import Calendar
import PersonalChat from "./pages/chat/PersonalChat";
import WorkspaceChat from "./pages/workspace/WorkspaceChat";
import { useSelector } from "react-redux";

import toast, { Toaster } from "react-hot-toast";
import AuthPage from "./pages/auth/AuthPage";

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Root />} />
                    <Route path="/login" element={<AuthRedirect />} />
                    <Route path="/signup" element={<AuthRedirect />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Workspace Selection Routes (Authenticated but no workspace context needed) */}
                    <Route element={<PrivateRoute requireWorkspace={false} />}>
                        <Route path="/workspace/select" element={<WorkspaceSelect />} />
                        <Route path="/workspace/create" element={<CreateWorkspace />} />
                        <Route path="/workspace/join" element={<JoinWorkspace />} />
                        <Route path="/profile" element={<Profile />} />
                        {/* Unified Dashboard (Handles both Personal and Workspace views) */}
                        <Route path="/user/dashboard" element={<UserDashboard />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />

                        {/* Global Features (Accessible in both Personal and Workspace modes) */}
                        <Route path="/user/tasks" element={<MyTasks />} />
                        <Route path="/user/attendance" element={<MyAttendance />} />
                        <Route path="/task-details/:id" element={<TaskDetails />} />
                        <Route path="/messages" element={<PersonalChat />} />
                    </Route>

                    {/* Workspace Protected Routes (Context Required) */}
                    <Route element={<PrivateRoute requireWorkspace={true} />}>
                        
                        {/* Admin Routes - Access control should be inside components now */}
                        <Route path="/admin/tasks" element={<ManageTasks />} />
                        <Route path="/admin/users" element={<ManageUsers />} />
                        <Route path="/admin/create-task" element={<CreateTask />} />
                        <Route path="/admin/attendance" element={<ManageAttendance />} />
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/workspace/settings" element={<WorkspaceSettings />} />
                        <Route path="/workspace/chat" element={<WorkspaceChat />} />
                    </Route>
                </Routes>
            </BrowserRouter>

            <Toaster />
        </div>
    );
};

export default App;

// Component to handle redirection from /login and /signup if already authenticated
const AuthRedirect = () => {
    const { currentUser } = useSelector((state) => state.user);

    if (currentUser) {
        return <Navigate to="/workspace/select" replace />;
    }

    return <AuthPage />;
};


const Root = () => {
    const { currentUser } = useSelector((state) => state.user);

    // If not logged in, show the landing page
    if (!currentUser) {
        return <Landing />;
    }

    // If logged in, allow access to the landing page, but provide a clear path back to the dashboard.
    return <Landing />;
};