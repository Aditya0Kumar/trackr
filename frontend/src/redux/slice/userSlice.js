import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    token: null,
    error: null,
    loading: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        signInSuccess: (state, action) => {
            state.loading = false;
            // Expect payload to have user and token: { ...user, token: "..." }
            // Or struct: { user: {...}, token: "..." }
            // Let's assume the payload IS the user object combined with token or we separate them.
            // The backend sends: { ...rest, token }. So payload has token inside it.
            state.currentUser = action.payload;
            
            // We can extract token if we want separate field, or just keep it in currentUser
            // Better to have explicit token field for clarity in axios interceptor
            if (action.payload.token) {
                 state.token = action.payload.token;
            }
            state.error = null;
        },

        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        signOutSuccess: (state) => {
            state.currentUser = null;
            state.token = null;
            state.error = null;
            state.loading = false;
        },
    },
});

export const { signInStart, signInSuccess, signInFailure, signOutSuccess } =
    userSlice.actions;

export default userSlice.reducer;
