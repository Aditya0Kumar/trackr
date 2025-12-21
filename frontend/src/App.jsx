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
import ResetPassword from "./pages/auth/ResetPassword"; // Import ResetPassword
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

                    {/* Shared Private Routes */}
                    <Route element={<PrivateRoute allowedRoles={["admin", "user"]} />}>
                        <Route path="/profile" element={<Profile />} />
                        {/* Task Details is now shared */}
                        <Route
                            path="/task-details/:id"
                            element={<TaskDetails />}
                        />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                        <Route
                            path="/admin/dashboard"
                            element={<Dashboard />}
                        />
                        <Route path="/admin/tasks" element={<ManageTasks />} />
                        <Route path="/admin/users" element={<ManageUsers />} />
                        <Route
                            path="/admin/create-task"
                            element={<CreateTask />}
                        />
                        <Route
                            path="/admin/attendance"
                            element={<ManageAttendance />}
                        />
                    </Route>

                    {/* User Routes */}
                    <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                        <Route
                            path="/user/dashboard"
                            element={<UserDashboard />}
                        />
                        <Route path="/user/tasks" element={<MyTasks />} />
                        <Route
                            path="/user/attendance"
                            element={<MyAttendance />}
                        />
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
        const dashboardPath = currentUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
        return <Navigate to={dashboardPath} replace />;
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