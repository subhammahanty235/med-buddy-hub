
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchPlatformMetrics } from '@/store/slices/adminSlice';
import { Users, UserCheck, Clock, DollarSign, TrendingUp, Activity } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { metrics, loading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPlatformMetrics());
  }, [dispatch]);

  if (loading || !metrics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const metricCards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      description: 'All registered users',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Doctors',
      value: metrics.totalDoctors.toLocaleString(),
      description: 'Verified and active doctors',
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      description: 'Users active this month',
      icon: Activity,
      color: 'text-orange-600'
    },
    {
      title: 'Pending Verifications',
      value: metrics.pendingVerifications.toLocaleString(),
      description: 'Doctors awaiting approval',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Total Revenue',
      value: `$${(metrics.totalRevenue / 1000).toFixed(0)}K`,
      description: 'Platform earnings',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Monthly Growth',
      value: `${metrics.monthlyGrowth}%`,
      description: 'User growth this month',
      icon: TrendingUp,
      color: 'text-emerald-600'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and key metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricCards.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Dr. Sarah Johnson completed consultation</span>
                  <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">New patient registration: Alice Brown</span>
                  <span className="text-xs text-gray-500 ml-auto">5 min ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Dr. Michael Chen pending verification</span>
                  <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Payment processed: $150</span>
                  <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Platform performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Server Uptime</span>
                  <span className="text-sm text-green-600 font-semibold">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm text-blue-600 font-semibold">145ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Active Sessions</span>
                  <span className="text-sm text-orange-600 font-semibold">342</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Error Rate</span>
                  <span className="text-sm text-red-600 font-semibold">0.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
