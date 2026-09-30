import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conferenceReducer from "./conferenceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conference: conferenceReducer,
  },
});