import {
    MdAddTask,
    MdDashboardCustomize,
    MdLogout,
    MdManageHistory,
    MdOutlineTaskAlt,
    MdPeopleAlt,
    MdPerson,
    MdCalendarToday, // Import MdCalendarToday
    MdSettings, // Import MdSettings
    MdMessage, // Import MdMessage
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
        label: "Calendar",
        icon: MdCalendarToday,
        path: "/calendar",
    },
    {
        id: 5,
        label: "Team Members",
        icon: MdPeopleAlt,
        path: "/admin/users",
    },
    {
        id: 6,
        label: "Manage Attendance",
        icon: MdCalendarToday,
        path: "/admin/attendance",
    },
    {
        id: 7,
        label: "Profile",
        icon: MdPerson,
        path: "/profile",
    },
    {
        id: 8,
        label: "Messages",
        icon: MdMessage,
        path: "/workspace/chat",
    },
    {
        id: 9,
        label: "Settings",
        icon: MdSettings,
        path: "/workspace/settings",
    },
    {
        id: 10,
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
        label: "Calendar",
        icon: MdCalendarToday,
        path: "/calendar",
    },
    {
        id: 4,
        label: "My Attendance",
        icon: MdCalendarToday,
        path: "/user/attendance",
    },
    {
        id: 5,
        label: "Profile",
        icon: MdPerson,
        path: "/profile",
    },
    {
        id: 6,
        label: "Workspaces",
        icon: MdDashboardCustomize,
        path: "/workspace/select",
    },
    {
        id: 7,
        label: "Settings",
        icon: MdSettings,
        path: "/workspace/settings",
    },
    {
        id: 8,
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