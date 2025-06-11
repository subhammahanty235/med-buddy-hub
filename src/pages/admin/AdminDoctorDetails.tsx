
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchDoctorAnalytics } from '@/store/slices/adminSlice';
import { 
  ArrowLeft, 
  DollarSign, 
  Clock, 
  Users, 
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const AdminDoctorDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { doctors, doctorAnalytics, loading } = useAppSelector((state) => state.admin);

  const doctor = doctors.find(d => d.id === doctorId);

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorAnalytics(doctorId));
    }
  }, [dispatch, doctorId]);

  if (!doctor) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Doctor not found</h2>
          <Button onClick={() => navigate('/admin/doctors')} className="mt-4">
            Back to Doctors
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/doctors')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Doctors</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
            <p className="text-gray-600">{doctor.specialization} • {doctor.experience}</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${doctorAnalytics?.totalEarnings.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">
                +{doctorAnalytics?.monthlyGrowth || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorAnalytics?.activeHours || 0}h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorAnalytics?.totalPatients || 0}</div>
              <p className="text-xs text-muted-foreground">
                {doctorAnalytics?.newPatientsThisMonth || 0} new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorAnalytics?.totalConsultations || 0}</div>
              <p className="text-xs text-muted-foreground">
                {doctorAnalytics?.consultationsThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Monthly Payments</span>
              </CardTitle>
              <CardDescription>Payment history and status</CardDescription>
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
                      <TableHead>Month</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctorAnalytics?.monthlyPayments?.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.month}</TableCell>
                        <TableCell>${payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
              <CardDescription>Doctor performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Patient Rating</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">{doctorAnalytics?.rating || 0}</span>
                    <span className="text-sm text-gray-500">/5.0</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm font-bold">{doctorAnalytics?.avgResponseTime || 0} min</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Consultation Success Rate</span>
                  <span className="text-sm font-bold">{doctorAnalytics?.successRate || 0}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">No-show Rate</span>
                  <span className="text-sm font-bold">{doctorAnalytics?.noShowRate || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest consultations and activities</CardDescription>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctorAnalytics?.recentActivity?.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                      <TableCell>{activity.patientName}</TableCell>
                      <TableCell className="capitalize">{activity.type}</TableCell>
                      <TableCell>{activity.duration} min</TableCell>
                      <TableCell>
                        {activity.status === 'completed' ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <AlertCircle className="h-4 w-4" />
                            <span>Cancelled</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>${activity.fee}</TableCell>
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

export default AdminDoctorDetails;
