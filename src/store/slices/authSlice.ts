
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  userType: 'patient' | 'doctor';
  specialization?: string;
  profilePicture?: string;
  bio?: string;
  consultationCharge?: number;
  availableTimes?: string[];
  verified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Mock API functions - replace these with actual API calls
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password, userType }: { email: string; password: string; userType: 'patient' | 'doctor' }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (userType === 'doctor') {
      return {
        id: 'doc1',
        email,
        name: 'Dr. Sarah Johnson',
        phone: '+1234567890',
        userType: 'doctor' as const,
        specialization: 'Cardiology',
        bio: 'Experienced cardiologist with 10+ years of practice',
        consultationCharge: 150,
        verified: true
      };
    }
    
    return {
      id: '1',
      email,
      name: 'John Doe',
      phone: '+1234567890',
      userType: 'patient' as const
    };
  }
);

export const signupWithEmail = createAsyncThunk(
  'auth/signupWithEmail',
  async ({ email, password, name, userType }: { email: string; password: string; name: string; userType: 'patient' | 'doctor' }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: userType === 'doctor' ? 'doc1' : '1',
      email,
      name,
      phone: '',
      userType,
      ...(userType === 'doctor' && { specialization: 'General Practice', verified: false })
    };
  }
);

export const loginWithOTP = createAsyncThunk(
  'auth/loginWithOTP',
  async ({ phone, otp, userType }: { phone: string; otp: string; userType: 'patient' | 'doctor' }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: userType === 'doctor' ? 'doc1' : '1',
      email: 'user@example.com',
      name: userType === 'doctor' ? 'Dr. John Doe' : 'John Doe',
      phone,
      userType,
      ...(userType === 'doctor' && { specialization: 'General Practice', verified: true })
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(signupWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Signup failed';
      })
      .addCase(loginWithOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'OTP verification failed';
      });
  },
});

export const { logout, clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
