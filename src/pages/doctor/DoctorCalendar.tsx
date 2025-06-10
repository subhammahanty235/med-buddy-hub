
import React, { useEffect, useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCalendarData, blockTimeSlot, removeBlockedSlot, setSelectedDate, setViewMode } from '@/store/slices/doctorCalendarSlice';
import { Calendar as CalendarIcon, Clock, Plus, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, parseISO } from 'date-fns';

const DoctorCalendar = () => {
  const dispatch = useAppDispatch();
  const { events, blockedSlots, selectedDate, viewMode, loading } = useAppSelector((state) => state.doctorCalendar);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    reason: ''
  });

  useEffect(() => {
    dispatch(fetchCalendarData());
  }, [dispatch]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      dispatch(setSelectedDate(date.toISOString().split('T')[0]));
    }
  };

  const handleBlockSlot = async () => {
    if (!blockForm.date || !blockForm.startTime || !blockForm.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const slotData = {
      date: blockForm.date,
      startTime: blockForm.startTime,
      endTime: blockForm.endTime,
      reason: blockForm.reason
    };

    try {
      await dispatch(blockTimeSlot(slotData)).unwrap();
      toast.success('Time slot blocked successfully');
      setIsBlockDialogOpen(false);
      setBlockForm({ date: '', startTime: '', endTime: '', reason: '' });
    } catch (error) {
      toast.error('Failed to block time slot');
    }
  };

  const handleRemoveBlock = async (slotId: string) => {
    try {
      await dispatch(removeBlockedSlot(slotId)).unwrap();
      toast.success('Blocked slot removed successfully');
    } catch (error) {
      toast.error('Failed to remove blocked slot');
    }
  };

  const selectedDateEvents = events.filter(event => event.date === selectedDate);
  const selectedDateBlocks = blockedSlots.filter(slot => slot.date === selectedDate);

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600">Manage your schedule and availability</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={viewMode} onValueChange={(value: any) => dispatch(setViewMode(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Block Time</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Block Time Slot</DialogTitle>
                  <DialogDescription>
                    Select a date and time range to make unavailable for bookings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="block-date">Date</Label>
                    <Input
                      id="block-date"
                      type="date"
                      value={blockForm.date}
                      onChange={(e) => setBlockForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={blockForm.startTime}
                        onChange={(e) => setBlockForm(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={blockForm.endTime}
                        onChange={(e) => setBlockForm(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reason">Reason (Optional)</Label>
                    <Textarea
                      id="reason"
                      placeholder="e.g., Lunch break, Personal appointment..."
                      value={blockForm.reason}
                      onChange={(e) => setBlockForm(prev => ({ ...prev, reason: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBlockSlot}>Block Time</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Component */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Calendar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate ? parseISO(selectedDate) : undefined}
                onSelect={handleDateSelect}
                className="rounded-md border"
                modifiers={{
                  hasEvent: events.map(event => parseISO(event.date)),
                  blocked: blockedSlots.map(slot => parseISO(slot.date))
                }}
                modifiersStyles={{
                  hasEvent: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
                  blocked: { backgroundColor: '#fee2e2', color: '#dc2626' }
                }}
              />
            </CardContent>
          </Card>

          {/* Daily Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Schedule for {selectedDate ? format(parseISO(selectedDate), 'EEEE, MMMM do, yyyy') : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {isToday(parseISO(selectedDate)) ? "Today's appointments and blocked times" : "Appointments and blocked times"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Appointments */}
              {selectedDateEvents.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Appointments</h4>
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.time} • {event.duration} minutes</p>
                            {event.patientName && (
                              <p className="text-sm text-blue-600">Patient: {event.patientName}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant={event.type === 'booking' ? 'default' : 'secondary'}>
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blocked Slots */}
              {selectedDateBlocks.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Blocked Time Slots</h4>
                  <div className="space-y-3">
                    {selectedDateBlocks.map((block) => (
                      <div key={block.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-red-100 p-2 rounded-full">
                            <X className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {block.startTime} - {block.endTime}
                            </p>
                            {block.reason && (
                              <p className="text-sm text-gray-600">{block.reason}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBlock(block.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDateEvents.length === 0 && selectedDateBlocks.length === 0 && (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments or blocked times for this date</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorCalendar;
