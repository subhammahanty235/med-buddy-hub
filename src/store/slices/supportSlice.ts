
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface SupportRequest {
  id: string;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'improvement';
  status: 'submitted' | 'under-review' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  response?: string;
}

interface SupportState {
  requests: SupportRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: SupportState = {
  requests: [],
  loading: false,
  error: null,
};

export const fetchSupportRequests = createAsyncThunk(
  'support/fetchRequests',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        title: 'Calendar view improvements',
        description: 'Would like to see a monthly view with better navigation',
        type: 'feature' as const,
        status: 'under-review' as const,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-16'
      },
      {
        id: '2',
        title: 'Export earnings data',
        description: 'Need ability to export earnings data to CSV',
        type: 'feature' as const,
        status: 'resolved' as const,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
        response: 'Feature has been implemented in the earnings section'
      }
    ];
  }
);

export const submitSupportRequest = createAsyncThunk(
  'support/submitRequest',
  async (requestData: Omit<SupportRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      ...requestData,
      id: Date.now().toString(),
      status: 'submitted' as const,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
  }
);

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchSupportRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch support requests';
      })
      .addCase(submitSupportRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
      });
  },
});

export default supportSlice.reducer;
