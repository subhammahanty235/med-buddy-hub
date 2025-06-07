
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchBookings } from '@/store/slices/bookingsSlice';
import { fetchBlogs } from '@/store/slices/blogsSlice';
import { 
  MessageCircle, 
  BookOpen, 
  Calendar, 
  Clock,
  Star,
  ArrowRight,
  Stethoscope,
  Heart,
  Brain,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { bookings, loading: bookingsLoading } = useAppSelector((state) => state.bookings);
  const { posts: blogs, loading: blogsLoading } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchBlogs());
  }, [dispatch]);

  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const pastBookings = bookings.filter(booking => booking.status === 'completed');

  const features = [
    {
      title: 'Talk to AI-Based Doctors',
      description: 'Get instant medical advice from AI specialists',
      icon: MessageCircle,
      color: 'bg-blue-500',
      path: '/ai-doctors',
      badge: 'AI Powered'
    },
    {
      title: 'Read Medical Blogs',
      description: 'Stay informed with expert health articles',
      icon: BookOpen,
      color: 'bg-green-500',
      path: '/blogs',
      badge: 'Expert Content'
    },
    {
      title: 'My Previous Doctor Visits',
      description: 'Review your consultation history and notes',
      icon: Clock,
      color: 'bg-purple-500',
      path: '/visits',
      badge: `${pastBookings.length} Visits`
    },
    {
      title: 'My Bookings',
      description: 'Manage your upcoming appointments',
      icon: Calendar,
      color: 'bg-orange-500',
      path: '/bookings',
      badge: `${upcomingBookings.length} Upcoming`
    }
  ];

  const specialties = [
    { name: 'Cardiology', icon: Heart, count: '3 Doctors' },
    { name: 'Neurology', icon: Brain, count: '2 Doctors' },
    { name: 'General', icon: Stethoscope, count: '5 Doctors' },
    { name: 'Dermatology', icon: Users, count: '4 Doctors' }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Welcome to HealthCare AI</h1>
            <p className="text-xl opacity-90 mb-6">
              Your comprehensive healthcare platform powered by artificial intelligence. 
              Get instant medical advice, book appointments, and manage your health journey.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/ai-doctors')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start AI Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`${feature.color} p-3 rounded-lg w-fit`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-gray-100">
                      {feature.badge}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon;
            return (
              <Card key={index} className="text-center p-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{specialty.name}</p>
                    <p className="text-sm text-gray-600">{specialty.count}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Upcoming Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{booking.doctorName}</p>
                        <p className="text-sm text-gray-600">{booking.specialization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{booking.date}</p>
                        <p className="text-sm text-gray-600">{booking.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>

          {/* Latest Blogs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span>Latest Health Articles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!blogsLoading && blogs.length > 0 ? (
                <div className="space-y-3">
                  {blogs.slice(0, 3).map((blog) => (
                    <div key={blog.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm line-clamp-2">{blog.title}</h4>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">{blog.category}</Badge>
                        <span className="text-xs text-gray-600">{blog.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">Loading articles...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
