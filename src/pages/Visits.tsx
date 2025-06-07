
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchBookings } from '@/store/slices/bookingsSlice';
import { 
  Calendar, 
  Clock, 
  User, 
  MessageCircle, 
  FileText, 
  Pill,
  Video,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Visits = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const pastBookings = bookings.filter(booking => booking.status === 'completed');

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
              <CardTitle className="text-lg">{booking.doctorName}</CardTitle>
              <p className="text-sm text-gray-600">{booking.specialization}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={booking.type === 'video' ? 'default' : 'secondary'}>
              {booking.type === 'video' ? <Video className="h-3 w-3 mr-1" /> : <MessageCircle className="h-3 w-3 mr-1" />}
              {booking.type === 'video' ? 'Video Call' : 'Chat'}
            </Badge>
            <Badge variant={isPast ? 'outline' : 'default'}>
              {isPast ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
              {booking.status}
            </Badge>
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

        {isPast && booking.notes && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Doctor's Notes</h4>
                <p className="text-sm text-blue-800 mt-1">{booking.notes}</p>
              </div>
            </div>
          </div>
        )}

        {isPast && booking.feedback && (
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <MessageCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-900">Doctor's Feedback</h4>
                <p className="text-sm text-green-800 mt-1">{booking.feedback}</p>
              </div>
            </div>
          </div>
        )}

        {isPast && booking.prescription && (
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Pill className="h-4 w-4 text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-purple-900">Prescription</h4>
                <p className="text-sm text-purple-800 mt-1">{booking.prescription}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your visits...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Visits</h1>
          <p className="text-gray-600">View your upcoming appointments and past consultation history</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upcoming" className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Upcoming ({upcomingBookings.length})</span>
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Past Visits ({pastBookings.length})</span>
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
                      You don't have any scheduled appointments. Book a consultation with our AI doctors.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPast={true} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">No Past Visits</h3>
                    <p className="text-gray-600 mt-1">
                      Your consultation history will appear here after your first appointment.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Visits;
