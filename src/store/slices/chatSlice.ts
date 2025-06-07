
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Doctor } from './doctorsSlice';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  image?: string;
}

export interface ChatSession {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  messages: ChatMessage[];
  isActive: boolean;
}

interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,
};

export const sendMessageToAI = createAsyncThunk(
  'chat/sendMessageToAI',
  async ({ sessionId, message, image }: { sessionId: string; message: string; image?: string }, { getState }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI responses
    const responses = [
      "Based on your symptoms, I recommend getting a proper examination. Can you tell me more about when these symptoms started?",
      "Thank you for sharing that information. I'd like to suggest scheduling an appointment with one of our specialists.",
      "From what you've described, this could be related to several conditions. Let me connect you with the right doctor.",
      "I understand your concern. For a proper diagnosis, I recommend consulting with our dermatology specialist Dr. Michael Chen.",
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Check if user is asking for doctor recommendations
    if (message.toLowerCase().includes('list of doctors') || message.toLowerCase().includes('doctor for my issue')) {
      return {
        sessionId,
        response: "Based on your symptoms, here are some doctors I recommend:\n\n1. **Dr. Sarah Johnson** - Cardiology (Available today)\n2. **Dr. Michael Chen** - Dermatology (Next available tomorrow)\n3. **Dr. Emily Rodriguez** - Neurology (Available this afternoon)\n\nWould you like me to help you book an appointment with any of these specialists?",
        suggestedDoctors: true
      };
    }
    
    return {
      sessionId,
      response: randomResponse,
      suggestedDoctors: false
    };
  }
);

export const startChatSession = createAsyncThunk(
  'chat/startChatSession',
  async (doctor: Doctor) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sessionId = `session_${Date.now()}`;
    const welcomeMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      content: `Hello! I'm AI Dr. ${doctor.name}, specializing in ${doctor.specialization}. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date().toISOString()
    };
    
    return {
      id: sessionId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      messages: [welcomeMessage],
      isActive: true
    };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<{ sessionId: string; message: string; image?: string }>) => {
      const { sessionId, message, image } = action.payload;
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        const newMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          content: message,
          sender: 'user',
          timestamp: new Date().toISOString(),
          image
        };
        session.messages.push(newMessage);
      }
    },
    setCurrentSession: (state, action: PayloadAction<string>) => {
      const session = state.sessions.find(s => s.id === action.payload);
      state.currentSession = session || null;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startChatSession.fulfilled, (state, action) => {
        state.sessions.push(action.payload);
        state.currentSession = action.payload;
      })
      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false;
        const { sessionId, response } = action.payload;
        const session = state.sessions.find(s => s.id === sessionId);
        if (session) {
          const aiMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            content: response,
            sender: 'ai',
            timestamp: new Date().toISOString()
          };
          session.messages.push(aiMessage);
        }
      })
      .addCase(sendMessageToAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const { addUserMessage, setCurrentSession, clearCurrentSession } = chatSlice.actions;
export default chatSlice.reducer;
