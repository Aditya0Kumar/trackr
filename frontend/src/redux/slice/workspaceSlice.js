import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload;
            state.loading = false; // Ensure loading is false when data set
            state.error = null;
        },
        setCurrentWorkspace: (state, action) => {
            state.currentWorkspace = action.payload;
             // If we set the workspace, we might want to ensure it's in the list too, but usually list is fetched separately.
        },
        addWorkspace: (state, action) => {
            state.workspaces.push(action.payload);
        },
        clearWorkspace: (state) => {
            state.workspaces = [];
            state.currentWorkspace = null;
            state.loading = false;
            state.error = null;
        },
        workspaceActionStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        workspaceActionFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        workspaceActionSuccess: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
});

export const {
    setWorkspaces,
    setCurrentWorkspace,
    addWorkspace,
    clearWorkspace,
    workspaceActionStart,
    workspaceActionFailure,
    workspaceActionSuccess
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
