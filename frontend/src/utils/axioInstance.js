import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
        // Access store directly via window.store (we will attach it in main.jsx)
        // This avoids circular dependency issues with direct imports
        const state = window.store?.getState();

        if (state) {
            const token = state.user?.token;
            const currentWorkspaceId = state.workspace?.currentWorkspace?._id;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (currentWorkspaceId) {
                config.headers["x-workspace-id"] = currentWorkspaceId;
            }
        }
        
        return config;
    },(error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
