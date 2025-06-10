import React, { useEffect, useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchSupportRequests, submitSupportRequest } from '@/store/slices/supportSlice';
import { 
  Plus,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  HelpCircle,
  FileText,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface SupportFormData {
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'improvement';
}

const DoctorSupport = () => {
  const dispatch = useAppDispatch();
  const { requests, loading } = useAppSelector((state) => state.support);
  const [showNewRequest, setShowNewRequest] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<SupportFormData>();
  const selectedType = watch('type');

  useEffect(() => {
    dispatch(fetchSupportRequests());
  }, [dispatch]);

  const onSubmitRequest = async (data: SupportFormData) => {
    try {
      await dispatch(submitSupportRequest(data)).unwrap();
      toast.success('Support request submitted successfully!');
      reset();
      setShowNewRequest(false);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'under-review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'feature':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'improvement':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading support requests...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600">Get help and submit feature requests</p>
          </div>
          <Button 
            onClick={() => setShowNewRequest(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Request</span>
          </Button>
        </div>

        <Tabs defaultValue="my-requests" className="w-full">
          <TabsList>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          {/* My Requests Tab */}
          <TabsContent value="my-requests" className="space-y-6">
            {showNewRequest && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Submit New Request</span>
                  </CardTitle>
                  <CardDescription>
                    Describe your issue or feature request in detail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmitRequest)} className="space-y-4">
                    <div>
                      <Label htmlFor="type">Request Type</Label>
                      <Select onValueChange={(value) => setValue('type', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bug">🐛 Bug Report</SelectItem>
                          <SelectItem value="feature">💡 Feature Request</SelectItem>
                          <SelectItem value="improvement">📈 Improvement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        {...register('title', { required: true })}
                        placeholder="Brief description of your request"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...register('description', { required: true })}
                        placeholder="Provide detailed information about your request..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowNewRequest(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Submit Request</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Existing Requests */}
            <div className="grid gap-4">
              {requests.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No support requests yet</h3>
                    <p className="text-gray-600 mb-4">Submit your first request to get started</p>
                    <Button onClick={() => setShowNewRequest(true)}>
                      Create New Request
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                requests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getTypeIcon(request.type)}
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{request.title}</h3>
                            <p className="text-gray-600 mt-1">{request.description}</p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                              <span>Created: {request.createdAt}</span>
                              <span>Updated: {request.updatedAt}</span>
                              <span className="capitalize">{request.type}</span>
                            </div>
                            {request.response && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-900">Response:</p>
                                <p className="text-sm text-blue-800 mt-1">{request.response}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions and answers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">How do I update my consultation fees?</h4>
                    <p className="text-gray-600 mt-1">Go to Profile Management → Professional tab and update your consultation fee. Changes will be reflected for new bookings.</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">How do I block certain time slots?</h4>
                    <p className="text-gray-600 mt-1">Use the Calendar view to mark specific dates or time slots as unavailable. This will prevent new bookings during those times.</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">When will I receive my earnings?</h4>
                    <p className="text-gray-600 mt-1">Earnings are processed weekly. You can view your payout history in the Earnings section.</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">How do I respond to patient feedback?</h4>
                    <p className="text-gray-600 mt-1">Patient feedback can be viewed in the Feedback section. You can flag inappropriate feedback for review.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Support</h4>
                      <p className="text-gray-600">support@doctorportal.com</p>
                      <p className="text-sm text-gray-500">Response time: 24-48 hours</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Phone Support</h4>
                      <p className="text-gray-600">+1 (800) 123-4567</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM EST</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Emergency Technical Issues</h4>
                      <p className="text-gray-600">emergency@doctorportal.com</p>
                      <p className="text-sm text-gray-500">For urgent platform issues only</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Feature Requests</h4>
                      <p className="text-gray-600">Use the form above or email features@doctorportal.com</p>
                      <p className="text-sm text-gray-500">We review all suggestions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  );
};

export default DoctorSupport;
