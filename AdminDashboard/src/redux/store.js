import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conferenceReducer from "./conferenceSlice";
import employeeReducer from "./employeeSlice";
import speakerReducer from "./speakersSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    conference: conferenceReducer,
    employee: employeeReducer,
    speaker: speakerReducer, 
  },
});