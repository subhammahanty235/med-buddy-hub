
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CommunicationMessage {
  id: string;
  content: string;
  sender: 'doctor' | 'patient';
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
  type: 'text' | 'attachment';
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface CommunicationSession {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  patientName: string;
  mode: 'chat' | 'video';
  status: 'active' | 'completed' | 'pending';
  appointmentType: 'chat' | 'video';
  messages: CommunicationMessage[];
  doctorNotes: string;
  feedback: string;
  isTyping: boolean;
  typingUser?: 'doctor' | 'patient';
}

interface CommunicationState {
  currentSession: CommunicationSession | null;
  loading: boolean;
  error: string | null;
  autoSaveTimer: number | null;
}

const initialState: CommunicationState = {
  currentSession: null,
  loading: false,
  error: null,
  autoSaveTimer: null,
};

export const startCommunicationSession = createAsyncThunk(
  'communication/startSession',
  async (sessionData: { doctorId: string; patientId: string; appointmentType: 'chat' | 'video' }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sessionId = `comm_${Date.now()}`;
    return {
      id: sessionId,
      doctorId: sessionData.doctorId,
      patientId: sessionData.patientId,
      doctorName: 'Dr. Sarah Johnson',
      patientName: 'John Doe',
      mode: sessionData.appointmentType,
      status: 'active' as const,
      appointmentType: sessionData.appointmentType,
      messages: [],
      doctorNotes: '',
      feedback: '',
      isTyping: false,
    };
  }
);

export const sendMessage = createAsyncThunk(
  'communication/sendMessage',
  async ({ sessionId, content, sender, type = 'text', attachmentUrl, attachmentName }: {
    sessionId: string;
    content: string;
    sender: 'doctor' | 'patient';
    type?: 'text' | 'attachment';
    attachmentUrl?: string;
    attachmentName?: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: `msg_${Date.now()}`,
      content,
      sender,
      timestamp: new Date().toISOString(),
      status: 'sent' as const,
      type,
      attachmentUrl,
      attachmentName,
    };
  }
);

export const saveNotes = createAsyncThunk(
  'communication/saveNotes',
  async ({ sessionId, notes }: { sessionId: string; notes: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { sessionId, notes };
  }
);

const communicationSlice = createSlice({
  name: 'communication',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'chat' | 'video'>) => {
      if (state.currentSession) {
        state.currentSession.mode = action.payload;
      }
    },
    updateNotes: (state, action: PayloadAction<string>) => {
      if (state.currentSession) {
        state.currentSession.doctorNotes = action.payload;
      }
    },
    updateFeedback: (state, action: PayloadAction<string>) => {
      if (state.currentSession) {
        state.currentSession.feedback = action.payload;
      }
    },
    setTyping: (state, action: PayloadAction<{ isTyping: boolean; user?: 'doctor' | 'patient' }>) => {
      if (state.currentSession) {
        state.currentSession.isTyping = action.payload.isTyping;
        state.currentSession.typingUser = action.payload.user;
      }
    },
    markSessionComplete: (state) => {
      if (state.currentSession) {
        state.currentSession.status = 'completed';
      }
    },
    updateMessageStatus: (state, action: PayloadAction<{ messageId: string; status: 'delivered' | 'seen' }>) => {
      if (state.currentSession) {
        const message = state.currentSession.messages.find(m => m.id === action.payload.messageId);
        if (message) {
          message.status = action.payload.status;
        }
      }
    },
    clearSession: (state) => {
      state.currentSession = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startCommunicationSession.fulfilled, (state, action) => {
        state.currentSession = action.payload;
        state.loading = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (state.currentSession) {
          state.currentSession.messages.push(action.payload);
        }
      })
      .addCase(saveNotes.fulfilled, (state, action) => {
        // Notes saved successfully
        state.loading = false;
      })
      .addCase(startCommunicationSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(startCommunicationSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to start session';
      });
  },
});

export const { 
  setMode, 
  updateNotes, 
  updateFeedback, 
  setTyping, 
  markSessionComplete, 
  updateMessageStatus,
  clearSession 
} = communicationSlice.actions;
export default communicationSlice.reducer;
