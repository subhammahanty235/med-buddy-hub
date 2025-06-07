
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import doctorsSlice from './slices/doctorsSlice';
import bookingsSlice from './slices/bookingsSlice';
import chatSlice from './slices/chatSlice';
import blogsSlice from './slices/blogsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    doctors: doctorsSlice,
    bookings: bookingsSlice,
    chat: chatSlice,
    blogs: blogsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
