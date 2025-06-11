
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface AdminDoctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  verified: boolean;
  consultationFee: number;
  joinedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  documents: {
    medicalLicense: string;
    degreesCertificates: string[];
    governmentId: string;
  };
  earnings: {
    thisMonth: number;
    total: number;
  };
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  userType: 'patient' | 'doctor';
  status: 'active' | 'suspended';
  joinedDate: string;
  lastActive: string;
}

export interface PlatformMetrics {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  activeUsers: number;
  pendingVerifications: number;
  totalConsultations: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface DoctorFeedback {
  id: string;
  doctorId: string;
  doctorName: string;
  type: 'complaint' | 'suggestion' | 'compliment';
  subject: string;
  message: string;
  date: string;
  status: 'open' | 'resolved' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
}

interface AdminState {
  doctors: AdminDoctor[];
  users: PlatformUser[];
  metrics: PlatformMetrics | null;
  feedbacks: DoctorFeedback[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  doctors: [],
  users: [],
  metrics: null,
  feedbacks: [],
  loading: false,
  error: null,
};

// Mock data
const mockDoctors: AdminDoctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1234567890',
    specialization: 'Cardiology',
    experience: '15 years',
    verified: true,
    consultationFee: 150,
    joinedDate: '2024-01-01',
    status: 'approved',
    documents: {
      medicalLicense: 'license-123.pdf',
      degreesCertificates: ['degree-1.pdf', 'cert-1.pdf'],
      governmentId: 'id-123.pdf'
    },
    earnings: { thisMonth: 15000, total: 180000 }
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1234567891',
    specialization: 'Dermatology',
    experience: '12 years',
    verified: false,
    consultationFee: 120,
    joinedDate: '2024-01-10',
    status: 'pending',
    documents: {
      medicalLicense: 'license-456.pdf',
      degreesCertificates: ['degree-2.pdf'],
      governmentId: 'id-456.pdf'
    },
    earnings: { thisMonth: 0, total: 0 }
  }
];

const mockUsers: PlatformUser[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    userType: 'patient',
    status: 'active',
    joinedDate: '2024-01-05',
    lastActive: '2024-01-20'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    userType: 'patient',
    status: 'active',
    joinedDate: '2024-01-08',
    lastActive: '2024-01-19'
  }
];

const mockMetrics: PlatformMetrics = {
  totalUsers: 1250,
  totalDoctors: 85,
  totalPatients: 1165,
  activeUsers: 890,
  pendingVerifications: 12,
  totalConsultations: 3420,
  totalRevenue: 512000,
  monthlyGrowth: 15.5
};

const mockFeedbacks: DoctorFeedback[] = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    type: 'complaint',
    subject: 'Long waiting time',
    message: 'Patients are waiting too long for appointments',
    date: '2024-01-15',
    status: 'open',
    priority: 'medium'
  },
  {
    id: '2',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    type: 'suggestion',
    subject: 'Feature request',
    message: 'Would like to have a calendar integration feature',
    date: '2024-01-18',
    status: 'in-progress',
    priority: 'low'
  }
];

export const fetchAdminDoctors = createAsyncThunk(
  'admin/fetchDoctors',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockDoctors;
  }
);

export const fetchPlatformUsers = createAsyncThunk(
  'admin/fetchUsers',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockUsers;
  }
);

export const fetchPlatformMetrics = createAsyncThunk(
  'admin/fetchMetrics',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockMetrics;
  }
);

export const fetchDoctorFeedbacks = createAsyncThunk(
  'admin/fetchFeedbacks',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockFeedbacks;
  }
);

export const verifyDoctor = createAsyncThunk(
  'admin/verifyDoctor',
  async ({ doctorId, status }: { doctorId: string; status: 'approved' | 'rejected' }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { doctorId, status };
  }
);

export const createDoctorProfile = createAsyncThunk(
  'admin/createDoctor',
  async (doctorData: { 
    name: string; 
    email: string; 
    phone: string; 
    specialization: string; 
    consultationFee: number 
  }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDoctor: AdminDoctor = {
      id: Date.now().toString(),
      ...doctorData,
      experience: '0 years',
      verified: false,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      documents: {
        medicalLicense: '',
        degreesCertificates: [],
        governmentId: ''
      },
      earnings: { thisMonth: 0, total: 0 }
    };
    return newDoctor;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    updateFeedbackStatus: (state, action) => {
      const feedback = state.feedbacks.find(f => f.id === action.payload.id);
      if (feedback) {
        feedback.status = action.payload.status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchAdminDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctors';
      })
      .addCase(fetchPlatformUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchPlatformMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
      })
      .addCase(fetchDoctorFeedbacks.fulfilled, (state, action) => {
        state.feedbacks = action.payload;
      })
      .addCase(verifyDoctor.fulfilled, (state, action) => {
        const doctor = state.doctors.find(d => d.id === action.payload.doctorId);
        if (doctor) {
          doctor.status = action.payload.status;
          doctor.verified = action.payload.status === 'approved';
        }
      })
      .addCase(createDoctorProfile.fulfilled, (state, action) => {
        state.doctors.unshift(action.payload);
      });
  },
});

export const { updateFeedbackStatus } = adminSlice.actions;
export default adminSlice.reducer;
