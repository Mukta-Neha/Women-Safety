import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import alertReducer from './slices/alertSlice';
import incidentReducer from './slices/incidentSlice';
import contactReducer from './slices/contactSlice';
import safeZoneReducer from './slices/safeZoneSlice';
import notificationReducer from './slices/notificationSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    incident: incidentReducer,
    contact: contactReducer,
    safeZone: safeZoneReducer,
    notification: notificationReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
