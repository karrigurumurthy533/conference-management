import { configureStore } from "@reduxjs/toolkit";

import employeeReducer from "./employeeSlice";

// ======================================================
// STORE
// ======================================================

const store = configureStore({
    reducer: {
        employee: employeeReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;