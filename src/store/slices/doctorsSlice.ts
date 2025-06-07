
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  avatar: string;
  isOnline: boolean;
  consultationFee: number;
  nextAvailable: string;
}

interface DoctorsState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorsState = {
  doctors: [],
  loading: false,
  error: null,
};

// Mock data
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    experience: '15 years',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    isOnline: true,
    consultationFee: 150,
    nextAvailable: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Dermatology',
    experience: '12 years',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
    isOnline: false,
    consultationFee: 120,
    nextAvailable: '2024-01-16T14:00:00Z'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Neurology',
    experience: '18 years',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1594824388066-d9e5b1b8e7c6?w=400',
    isOnline: true,
    consultationFee: 180,
    nextAvailable: '2024-01-15T16:00:00Z'
  },
  {
    id: '4',
    name: 'Dr. David Kumar',
    specialization: 'Orthopedics',
    experience: '20 years',
    rating: 4.6,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    isOnline: true,
    consultationFee: 160,
    nextAvailable: '2024-01-15T11:30:00Z'
  }
];

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockDoctors;
  }
);

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctors';
      });
  },
});

export default doctorsSlice.reducer;
