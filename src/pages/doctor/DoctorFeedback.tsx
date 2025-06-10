
import React, { useEffect, useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchDoctorBookings } from '@/store/slices/doctorBookingsSlice';
import { Star, MessageSquare, Filter, Search, TrendingUp } from 'lucide-react';

const DoctorFeedback = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading } = useAppSelector((state) => state.doctorBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    dispatch(fetchDoctorBookings());
  }, [dispatch]);

  // Get bookings with feedback
  const feedbackBookings = bookings.filter(booking => 
    booking.status === 'completed' && booking.patientFeedback
  );

  // Filter and search feedback
  const filteredFeedback = feedbackBookings.filter(booking => {
    const matchesSearch = booking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.patientFeedback?.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || 
      booking.patientFeedback?.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesRating;
  });

  // Sort feedback
  const sortedFeedback = [...filteredFeedback].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortOrder === 'highest') {
      return (b.patientFeedback?.rating || 0) - (a.patientFeedback?.rating || 0);
    } else {
      return (a.patientFeedback?.rating || 0) - (b.patientFeedback?.rating || 0);
    }
  });

  // Calculate stats
  const totalFeedbacks = feedbackBookings.length;
  const averageRating = totalFeedbacks > 0 
    ? feedbackBookings.reduce((acc, booking) => acc + (booking.patientFeedback?.rating || 0), 0) / totalFeedbacks
    : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbackBookings.filter(booking => booking.patientFeedback?.rating === rating).length
  }));

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading feedback...</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Feedback</h1>
          <p className="text-gray-600">View and analyze patient reviews and ratings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{totalFeedbacks}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {ratingDistribution[0].count}
                  </p>
                  <p className="text-xs text-green-600">
                    {totalFeedbacks > 0 ? ((ratingDistribution[0].count / totalFeedbacks) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of ratings received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count }) => {
                const percentage = totalFeedbacks > 0 ? (count / totalFeedbacks) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by patient name or comment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                  <SelectItem value="lowest">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="space-y-4">
          {sortedFeedback.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{booking.patientName}</h3>
                        <Badge variant="outline">{booking.type}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderStars(booking.patientFeedback?.rating || 0)}
                        <span className="text-sm text-gray-600">
                          {booking.patientFeedback?.rating}/5
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{booking.patientFeedback?.comment}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Consultation on {booking.date} at {booking.time}</span>
                      <span>2 days ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedFeedback.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
              <p className="text-gray-600">
                {feedbackBookings.length === 0 
                  ? "You haven't received any patient feedback yet."
                  : "No feedback matches your current filters."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorFeedback;
