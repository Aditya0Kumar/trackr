import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import uiReducer from "./slice/uiSlice";
import workspaceReducer from "./slice/workspaceSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
    user: userReducer,
    ui: uiReducer,
    workspace: workspaceReducer,
});

const persistConfig = {
    key: "root",
    storage,
    version: 1,
    whitelist: ['user', 'ui', 'workspace']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false });
    },
});

export const persistor = persistStore(store);