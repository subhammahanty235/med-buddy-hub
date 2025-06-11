
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchDoctorFeedbacks, updateFeedbackStatus } from '@/store/slices/adminSlice';
import { MessageSquare, AlertTriangle, ThumbsUp, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';

const AdminFeedback = () => {
  const dispatch = useAppDispatch();
  const { feedbacks, loading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDoctorFeedbacks());
  }, [dispatch]);

  const handleUpdateStatus = (id: string, status: 'resolved' | 'in-progress') => {
    dispatch(updateFeedbackStatus({ id, status }));
    toast.success(`Feedback marked as ${status}`);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'complaint':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Complaint</Badge>;
      case 'suggestion':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Suggestion</Badge>;
      case 'compliment':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Compliment</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Open</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'suggestion':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'compliment':
        return <ThumbsUp className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Feedback</h1>
          <p className="text-gray-600">Manage feedback and support requests from doctors</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Feedback</CardTitle>
            <CardDescription>
              Doctor complaints, suggestions, and compliments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div className="flex items-start space-x-3">
                          {getTypeIcon(feedback.type)}
                          <div className="max-w-xs">
                            <div className="font-medium text-sm">{feedback.subject}</div>
                            <div className="text-sm text-gray-500 truncate">{feedback.message}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{feedback.doctorName}</TableCell>
                      <TableCell>{getTypeBadge(feedback.type)}</TableCell>
                      <TableCell>{getPriorityBadge(feedback.priority)}</TableCell>
                      <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                      <TableCell>{new Date(feedback.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {feedback.status === 'open' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(feedback.id, 'in-progress')}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                          {feedback.status !== 'resolved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(feedback.id, 'resolved')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;
