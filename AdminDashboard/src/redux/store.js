import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conferenceReducer from "./conferenceSlice";
import employeeReducer from "./employeeSlice";
import speakerReducer from "./speakersSlice";
import brochureReducer from "./brochuerSlice";
import dashboardReducer from "./dashboardSlice";
import reviewsReducer from "./reviewsSlice";
import registrationsReducer from "./registrationsSlice";
import notificationReducer from "./notificationSlice";
import abstractsReducer from "./abstractsSlice";
import subscriberReducer from "./subscribeSlice";
import invoiceReducer from "./invoiceSlice";




export const store = configureStore({
  reducer: {
    auth: authReducer,
    conference: conferenceReducer,
    employee: employeeReducer,
    speaker: speakerReducer, 
    brochure: brochureReducer,
    abstracts: abstractsReducer,
    dashboard: dashboardReducer,
    reviews: reviewsReducer,
    registrations: registrationsReducer,
    subscriber: subscriberReducer,
    notifications: notificationReducer,
    invoice: invoiceReducer,
  


  },
});