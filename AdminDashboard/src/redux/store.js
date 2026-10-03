import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conferenceReducer from "./conferenceSlice";
import employeeReducer from "./employeeSlice";
import speakerReducer from "./speakersSlice";
import brochureReducer from "./brochuerSlice";
import dashboardReducer from "./dashboardSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    conference: conferenceReducer,
    employee: employeeReducer,
    speaker: speakerReducer, 
    brochure: brochureReducer,
    dashboard: dashboardReducer,

  },
});