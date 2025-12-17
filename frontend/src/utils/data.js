import {
    MdAddTask,
    MdDashboardCustomize,
    MdLogout,
    MdManageHistory,
    MdOutlineTaskAlt,
    MdPeopleAlt,
    MdPerson,
    MdCalendarToday, // Import MdCalendarToday for Attendance
} from "react-icons/md";

export const SIDE_MENU_DATA = [
    {
        id: 1,
        label: "Dashboard",
        icon: MdDashboardCustomize,
        path: "/admin/dashboard",
    },
    {
        id: 2,
        label: "Manage Task",
        icon: MdManageHistory,
        path: "/admin/tasks",
    },
    {
        id: 3,
        label: "Create Task",
        icon: MdAddTask,
        path: "/admin/create-task",
    },
    {
        id: 4,
        label: "Team Members",
        icon: MdPeopleAlt,
        path: "/admin/users",
    },
    {
        id: 5,
        label: "Manage Attendance", // New Admin Link
        icon: MdCalendarToday,
        path: "/admin/attendance",
    },
    {
        id: 6,
        label: "Profile",
        icon: MdPerson,
        path: "/profile",
    },
    {
        id: 7,
        label: "Logout",
        icon: MdLogout,
        path: "logout",
    },
];

export const USER_SIDE_MENU_DATA = [
    {
        id: 1,
        label: "Dashboard",
        icon: MdDashboardCustomize,
        path: "/user/dashboard",
    },
    {
        id: 2,
        label: "My Tasks",
        icon: MdOutlineTaskAlt,
        path: "/user/tasks",
    },
    {
        id: 3,
        label: "My Attendance", // New User Link
        icon: MdCalendarToday,
        path: "/user/attendance",
    },
    {
        id: 4,
        label: "Profile",
        icon: MdPerson,
        path: "/profile",
    },
    {
        id: 5,
        label: "Logout",
        icon: MdLogout,
        path: "logout",
    },
];

export const PRIORITY_DATA = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
];

export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Awaiting Verification", value: "Awaiting Verification" },
    { label: "Completed", value: "Completed" },
];