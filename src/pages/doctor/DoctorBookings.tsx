import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '@/components/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchDoctorBookings, setFilters, updateBookingNotes } from '@/store/slices/doctorBookingsSlice';
import { startCommunicationSession } from '@/store/slices/communicationSlice';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MessageCircle, 
  Video,
  Filter,
  Download,
  Edit,
  Save,
  X,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

const DoctorBookings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { bookings, loading, filters } = useAppSelector((state) => state.doctorBookings);
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    notes: '',
    diagnosis: '',
    prescription: ''
  });

  useEffect(() => {
    dispatch(fetchDoctorBookings());
  }, [dispatch]);

  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const pastBookings = bookings.filter(booking => booking.status === 'completed');

  const filteredPastBookings = pastBookings.filter(booking => {
    if (filters.patientName && !booking.patientName.toLowerCase().includes(filters.patientName.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleStartSession = async (booking: any) => {
    await dispatch(startCommunicationSession({
      doctorId: 'doctor_1',
      patientId: booking.patientId,
      appointmentType: booking.type
    }));
    navigate('/doctor/communication');
  };

  const handleStartEdit = (booking: any) => {
    setEditingBooking(booking.id);
    setEditForm({
      notes: booking.notes || '',
      diagnosis: booking.diagnosis || '',
      prescription: booking.prescription || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;
    
    try {
      await dispatch(updateBookingNotes({
        bookingId: editingBooking,
        ...editForm
      })).unwrap();
      
      setEditingBooking(null);
      toast.success('Consultation notes updated successfully');
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const BookingCard = ({ booking, isPast = false }: { booking: any; isPast?: boolean }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{booking.patientName}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{booking.patientPhone}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={booking.type === 'video' ? 'default' : 'secondary'}>
              {booking.type === 'video' ? <Video className="h-3 w-3 mr-1" /> : <MessageCircle className="h-3 w-3 mr-1" />}
              {booking.type === 'video' ? 'Video Call' : 'Chat'}
            </Badge>
            <Badge variant="outline">
              ${booking.consultationFee}
            </Badge>
            {!isPast && (
              <Button 
                size="sm"
                onClick={() => handleStartSession(booking)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-3 w-3 mr-1" />
                Start Session
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{booking.time}</span>
          </div>
        </div>

        {isPast && (
          <div className="space-y-4">
            {editingBooking === booking.id ? (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Edit Consultation Notes</h4>
                  <div className="space-x-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingBooking(null)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Consultation notes..."
                    />
                  </div>
                  <div>
                    <Label>Diagnosis</Label>
                    <Input
                      value={editForm.diagnosis}
                      onChange={(e) => setEditForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                      placeholder="Diagnosis..."
                    />
                  </div>
                  <div>
                    <Label>Prescription</Label>
                    <Textarea
                      value={editForm.prescription}
                      onChange={(e) => setEditForm(prev => ({ ...prev, prescription: e.target.value }))}
                      placeholder="Prescription details..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {booking.notes && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Consultation Notes</h4>
                        <p className="text-sm text-blue-800 mt-1">{booking.notes}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleStartEdit(booking)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {booking.diagnosis && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">Diagnosis</h4>
                    <p className="text-sm text-green-800 mt-1">{booking.diagnosis}</p>
                  </div>
                )}

                {booking.prescription && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-900">Prescription</h4>
                    <p className="text-sm text-purple-800 mt-1">{booking.prescription}</p>
                  </div>
                )}

                {!booking.notes && !booking.diagnosis && !booking.prescription && (
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-2">No consultation notes yet</p>
                    <Button size="sm" onClick={() => handleStartEdit(booking)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Add Notes
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600">Manage your patient appointments and consultations</p>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Consultations ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPast={false} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">No Upcoming Appointments</h3>
                    <p className="text-gray-600 mt-1">
                      Your schedule is clear. New appointments will appear here.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Search by patient name..."
                  value={filters.patientName}
                  onChange={(e) => dispatch(setFilters({ patientName: e.target.value }))}
                  className="max-w-xs"
                />
              </div>
            </Card>

            {filteredPastBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredPastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPast={true} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <MessageCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">No Past Consultations</h3>
                    <p className="text-gray-600 mt-1">
                      Completed consultations will appear here.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  );
};

export default DoctorBookings;
