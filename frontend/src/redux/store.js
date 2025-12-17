import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import uiReducer from "./slice/uiSlice"; // Import uiReducer
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
    user: userReducer,
    ui: uiReducer, // Add uiReducer
});

const persistConfig = {
    key: "root",
    storage,
    version: 1,
    whitelist: ['user', 'ui'] // Ensure 'ui' state is persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false });
    },
});

export const persistor = persistStore(store);