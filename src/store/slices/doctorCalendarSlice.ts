
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'booking' | 'blocked';
  patientName?: string;
  duration: number;
}

export interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

interface DoctorCalendarState {
  events: CalendarEvent[];
  blockedSlots: BlockedSlot[];
  selectedDate: string;
  viewMode: 'day' | 'week' | 'month';
  loading: boolean;
  error: string | null;
}

const initialState: DoctorCalendarState = {
  events: [],
  blockedSlots: [],
  selectedDate: new Date().toISOString().split('T')[0],
  viewMode: 'week',
  loading: false,
  error: null,
};

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Consultation with Alice Johnson',
    date: '2024-01-22',
    time: '10:00 AM',
    type: 'booking',
    patientName: 'Alice Johnson',
    duration: 30
  },
  {
    id: '2',
    title: 'Consultation with Bob Smith',
    date: '2024-01-23',
    time: '2:00 PM',
    type: 'booking',
    patientName: 'Bob Smith',
    duration: 30
  },
];

const mockBlockedSlots: BlockedSlot[] = [
  {
    id: '1',
    date: '2024-01-24',
    startTime: '12:00',
    endTime: '14:00',
    reason: 'Lunch break'
  }
];

export const fetchCalendarData = createAsyncThunk(
  'doctorCalendar/fetchData',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { events: mockEvents, blockedSlots: mockBlockedSlots };
  }
);

export const blockTimeSlot = createAsyncThunk(
  'doctorCalendar/blockSlot',
  async (slotData: Omit<BlockedSlot, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...slotData, id: Date.now().toString() };
  }
);

export const removeBlockedSlot = createAsyncThunk(
  'doctorCalendar/removeBlock',
  async (slotId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return slotId;
  }
);

const doctorCalendarSlice = createSlice({
  name: 'doctorCalendar',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarData.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.blockedSlots = action.payload.blockedSlots;
      })
      .addCase(fetchCalendarData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch calendar data';
      })
      .addCase(blockTimeSlot.fulfilled, (state, action) => {
        state.blockedSlots.push(action.payload);
      })
      .addCase(removeBlockedSlot.fulfilled, (state, action) => {
        state.blockedSlots = state.blockedSlots.filter(slot => slot.id !== action.payload);
      });
  },
});

export const { setSelectedDate, setViewMode } = doctorCalendarSlice.actions;
export default doctorCalendarSlice.reducer;
