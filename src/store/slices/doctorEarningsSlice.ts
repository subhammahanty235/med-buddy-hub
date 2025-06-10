
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
  dailyEarnings: number;
  averagePerConsultation: number;
  totalConsultations: number;
  monthlyBreakdown: { month: string; earnings: number; consultations: number }[];
  payoutHistory: { id: string; amount: number; date: string; status: 'paid' | 'pending' }[];
}

interface DoctorEarningsState {
  earnings: EarningsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorEarningsState = {
  earnings: null,
  loading: false,
  error: null,
};

const mockEarningsData: EarningsData = {
  totalEarnings: 15000,
  monthlyEarnings: 4500,
  weeklyEarnings: 1200,
  dailyEarnings: 300,
  averagePerConsultation: 150,
  totalConsultations: 100,
  monthlyBreakdown: [
    { month: 'Jan 2024', earnings: 4500, consultations: 30 },
    { month: 'Dec 2023', earnings: 3800, consultations: 25 },
    { month: 'Nov 2023', earnings: 4200, consultations: 28 },
    { month: 'Oct 2023', earnings: 2500, consultations: 17 },
  ],
  payoutHistory: [
    { id: '1', amount: 4500, date: '2024-01-01', status: 'paid' },
    { id: '2', amount: 3800, date: '2023-12-01', status: 'paid' },
    { id: '3', amount: 4200, date: '2023-11-01', status: 'paid' },
    { id: '4', amount: 1200, date: '2024-01-15', status: 'pending' },
  ]
};

export const fetchDoctorEarnings = createAsyncThunk(
  'doctorEarnings/fetchEarnings',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockEarningsData;
  }
);

const doctorEarningsSlice = createSlice({
  name: 'doctorEarnings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
      })
      .addCase(fetchDoctorEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch earnings';
      });
  },
});

export default doctorEarningsSlice.reducer;
