import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSidebarCollapsed: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebarCollapse: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        },
        setSidebarCollapse: (state, action) => {
            state.isSidebarCollapsed = action.payload;
        },
    },
});

export const { toggleSidebarCollapse, setSidebarCollapse } = uiSlice.actions;

export default uiSlice.reducer;