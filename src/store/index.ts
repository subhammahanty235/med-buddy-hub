
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import doctorsSlice from './slices/doctorsSlice';
import bookingsSlice from './slices/bookingsSlice';
import chatSlice from './slices/chatSlice';
import blogsSlice from './slices/blogsSlice';
import doctorBookingsSlice from './slices/doctorBookingsSlice';
import doctorEarningsSlice from './slices/doctorEarningsSlice';
import doctorCalendarSlice from './slices/doctorCalendarSlice';
import supportSlice from './slices/supportSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    doctors: doctorsSlice,
    bookings: bookingsSlice,
    chat: chatSlice,
    blogs: blogsSlice,
    doctorBookings: doctorBookingsSlice,
    doctorEarnings: doctorEarningsSlice,
    doctorCalendar: doctorCalendarSlice,
    support: supportSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
