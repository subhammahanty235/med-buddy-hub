
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface DoctorBooking {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'chat';
  notes?: string;
  diagnosis?: string;
  prescription?: string;
  consultationFee: number;
  patientFeedback?: {
    rating: number;
    comment: string;
    date: string;
  };
}

interface DoctorBookingsState {
  bookings: DoctorBooking[];
  loading: boolean;
  error: string | null;
  filters: {
    dateRange: { start: string; end: string } | null;
    patientName: string;
    status: string;
  };
}

const initialState: DoctorBookingsState = {
  bookings: [],
  loading: false,
  error: null,
  filters: {
    dateRange: null,
    patientName: '',
    status: 'all'
  }
};

const mockDoctorBookings: DoctorBooking[] = [
  {
    id: '1',
    patientId: 'p1',
    patientName: 'Alice Johnson',
    patientPhone: '+1234567890',
    date: '2024-01-22',
    time: '10:00 AM',
    status: 'upcoming',
    type: 'video',
    consultationFee: 150
  },
  {
    id: '2',
    patientId: 'p2',
    patientName: 'Bob Smith',
    patientPhone: '+1234567891',
    date: '2024-01-15',
    time: '2:00 PM',
    status: 'completed',
    type: 'chat',
    notes: 'Patient complained of chest pain. ECG normal.',
    diagnosis: 'Anxiety-related chest pain',
    prescription: 'Stress management techniques',
    consultationFee: 150,
    patientFeedback: {
      rating: 5,
      comment: 'Very helpful and understanding doctor!',
      date: '2024-01-15'
    }
  },
  {
    id: '3',
    patientId: 'p3',
    patientName: 'Carol Davis',
    patientPhone: '+1234567892',
    date: '2024-01-10',
    time: '4:00 PM',
    status: 'completed',
    type: 'video',
    notes: 'Follow-up consultation for hypertension',
    diagnosis: 'Controlled hypertension',
    prescription: 'Continue current medication',
    consultationFee: 150,
    patientFeedback: {
      rating: 4,
      comment: 'Good consultation, clear explanations',
      date: '2024-01-10'
    }
  }
];

export const fetchDoctorBookings = createAsyncThunk(
  'doctorBookings/fetchBookings',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockDoctorBookings;
  }
);

export const updateBookingNotes = createAsyncThunk(
  'doctorBookings/updateNotes',
  async ({ bookingId, notes, diagnosis, prescription }: { 
    bookingId: string; 
    notes: string; 
    diagnosis: string; 
    prescription: string; 
  }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { bookingId, notes, diagnosis, prescription };
  }
);

const doctorBookingsSlice = createSlice({
  name: 'doctorBookings',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        dateRange: null,
        patientName: '',
        status: 'all'
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchDoctorBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      .addCase(updateBookingNotes.fulfilled, (state, action) => {
        const booking = state.bookings.find(b => b.id === action.payload.bookingId);
        if (booking) {
          booking.notes = action.payload.notes;
          booking.diagnosis = action.payload.diagnosis;
          booking.prescription = action.payload.prescription;
          booking.status = 'completed';
        }
      });
  },
});

export const { setFilters, clearFilters } = doctorBookingsSlice.actions;
export default doctorBookingsSlice.reducer;
