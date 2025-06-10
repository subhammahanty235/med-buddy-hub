
import React, { useEffect } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchDoctorBookings } from '@/store/slices/doctorBookingsSlice';
import { fetchDoctorEarnings } from '@/store/slices/doctorEarningsSlice';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp,
  Star,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { bookings, loading: bookingsLoading } = useAppSelector((state) => state.doctorBookings);
  const { earnings, loading: earningsLoading } = useAppSelector((state) => state.doctorEarnings);

  useEffect(() => {
    dispatch(fetchDoctorBookings());
    dispatch(fetchDoctorEarnings());
  }, [dispatch]);

  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const completedBookings = bookings.filter(booking => booking.status === 'completed');
  const averageRating = completedBookings.reduce((acc, booking) => 
    acc + (booking.patientFeedback?.rating || 0), 0) / completedBookings.length || 0;

  const stats = [
    {
      title: 'Today\'s Appointments',
      value: upcomingBookings.filter(b => 
        new Date(b.date).toDateString() === new Date().toDateString()
      ).length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Monthly Earnings',
      value: `$${earnings?.monthlyEarnings || 0}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Patients',
      value: completedBookings.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  if (bookingsLoading || earningsLoading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your practice overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>Upcoming consultations for today</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/doctor/bookings')}
                className="flex items-center space-x-2"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.patientName}</p>
                      <p className="text-sm text-gray-600">{booking.time}</p>
                    </div>
                  </div>
                  <Badge variant={booking.type === 'video' ? 'default' : 'secondary'}>
                    {booking.type}
                  </Badge>
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <p className="text-center text-gray-500 py-4">No appointments today</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Feedback */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest patient reviews</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/doctor/feedback')}
                className="flex items-center space-x-2"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedBookings
                .filter(b => b.patientFeedback)
                .slice(0, 3)
                .map((booking) => (
                <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{booking.patientName}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{booking.patientFeedback?.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{booking.patientFeedback?.comment}</p>
                </div>
              ))}
              {completedBookings.filter(b => b.patientFeedback).length === 0 && (
                <p className="text-center text-gray-500 py-4">No feedback yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key sections of your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center space-y-2"
                onClick={() => navigate('/doctor/calendar')}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Calendar</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center space-y-2"
                onClick={() => navigate('/doctor/earnings')}
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Earnings</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center space-y-2"
                onClick={() => navigate('/doctor/profile')}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Profile</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center space-y-2"
                onClick={() => navigate('/doctor/support')}
              >
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
