
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchDoctors } from '@/store/slices/doctorsSlice';
import { startChatSession } from '@/store/slices/chatSlice';
import { Star, MessageCircle, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const AIDoctors = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { doctors, loading } = useAppSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleStartChat = async (doctor: any) => {
    try {
      await dispatch(startChatSession(doctor)).unwrap();
      navigate(`/chat/${doctor.id}`);
      toast.success(`Started chat with AI Dr. ${doctor.name}`);
    } catch (error) {
      toast.error('Failed to start chat session');
    }
  };

  const getSpecializationColor = (specialization: string) => {
    const colors: { [key: string]: string } = {
      'Cardiology': 'bg-red-100 text-red-800',
      'Dermatology': 'bg-green-100 text-green-800',
      'Neurology': 'bg-purple-100 text-purple-800',
      'Orthopedics': 'bg-blue-100 text-blue-800',
    };
    return colors[specialization] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">AI-Powered Doctors</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant medical consultation from our AI specialists. Each doctor is trained 
            in their specific field to provide you with accurate health guidance.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-lg text-gray-900">AI {doctor.name}</h3>
                      {doctor.isOnline && (
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <Badge className={getSpecializationColor(doctor.specialization)}>
                      {doctor.specialization}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{doctor.experience}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>${doctor.consultationFee}</span>
                    </div>
                    <Badge variant={doctor.isOnline ? "default" : "secondary"}>
                      {doctor.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Button 
                  className="w-full group-hover:scale-105 transition-transform"
                  onClick={() => handleStartChat(doctor)}
                  disabled={!doctor.isOnline}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {doctor.isOnline ? 'Start AI Chat' : 'Currently Offline'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">How AI Consultation Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="space-y-2">
                  <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    1
                  </div>
                  <h3 className="font-semibold">Choose a Specialist</h3>
                  <p className="text-sm text-gray-600">Select an AI doctor based on your health concern</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    2
                  </div>
                  <h3 className="font-semibold">Start Conversation</h3>
                  <p className="text-sm text-gray-600">Describe your symptoms or upload images</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    3
                  </div>
                  <h3 className="font-semibold">Get Guidance</h3>
                  <p className="text-sm text-gray-600">Receive instant medical advice and recommendations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIDoctors;
