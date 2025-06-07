
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'chat';
  notes?: string;
  feedback?: string;
  prescription?: string;
}

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null,
};

const mockBookings: Booking[] = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    date: '2024-01-20',
    time: '10:00 AM',
    status: 'upcoming',
    type: 'video'
  },
  {
    id: '2',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    specialization: 'Dermatology',
    date: '2024-01-10',
    time: '2:00 PM',
    status: 'completed',
    type: 'chat',
    notes: 'Skin condition improving. Continue current medication.',
    feedback: 'Patient showing good progress with prescribed treatment. Follow up in 2 weeks.',
    prescription: 'Hydrocortisone cream 1% - Apply twice daily'
  },
  {
    id: '3',
    doctorId: '3',
    doctorName: 'Dr. Emily Rodriguez',
    specialization: 'Neurology',
    date: '2024-01-05',
    time: '4:00 PM',
    status: 'completed',
    type: 'video',
    notes: 'Headache symptoms reduced significantly.',
    feedback: 'Migraine treatment is working well. Stress management techniques recommended.',
    prescription: 'Sumatriptan 50mg - As needed for severe headaches'
  }
];

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockBookings;
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      });
  },
});

export default bookingsSlice.reducer;
