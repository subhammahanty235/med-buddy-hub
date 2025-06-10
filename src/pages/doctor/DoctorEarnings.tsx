
import React, { useEffect } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchDoctorEarnings } from '@/store/slices/doctorEarningsSlice';
import { DollarSign, TrendingUp, Users, Calendar, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const DoctorEarnings = () => {
  const dispatch = useAppDispatch();
  const { earnings, loading } = useAppSelector((state) => state.doctorEarnings);

  useEffect(() => {
    dispatch(fetchDoctorEarnings());
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${earnings?.totalEarnings || 0}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12.5%'
    },
    {
      title: 'Monthly Earnings',
      value: `$${earnings?.monthlyEarnings || 0}`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+8.2%'
    },
    {
      title: 'Avg per Consultation',
      value: `$${earnings?.averagePerConsultation || 0}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+5.1%'
    },
    {
      title: 'Total Consultations',
      value: earnings?.totalConsultations || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+15.3%'
    }
  ];

  const chartConfig = {
    earnings: {
      label: "Earnings",
      color: "hsl(var(--chart-1))",
    },
    consultations: {
      label: "Consultations",
      color: "hsl(var(--chart-2))",
    },
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading earnings data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Earnings & Analytics</h1>
            <p className="text-gray-600">Track your income and consultation statistics</p>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Earnings Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings Trend</CardTitle>
              <CardDescription>Your earnings progression over the last few months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earnings?.monthlyBreakdown || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="var(--color-earnings)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-earnings)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Consultations vs Earnings */}
          <Card>
            <CardHeader>
              <CardTitle>Consultations vs Earnings</CardTitle>
              <CardDescription>Relationship between consultation count and earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earnings?.monthlyBreakdown || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      yAxisId="left" 
                      dataKey="earnings" 
                      fill="var(--color-earnings)" 
                      name="Earnings ($)"
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="consultations" 
                      fill="var(--color-consultations)" 
                      name="Consultations"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>Recent payouts and pending payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings?.payoutHistory?.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">#{payout.id}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ${payout.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{payout.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={payout.status === 'paid' ? 'default' : 'secondary'}
                        className={payout.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">${earnings?.weeklyEarnings || 0}</div>
              <p className="text-sm text-gray-600">This Week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">${earnings?.dailyEarnings || 0}</div>
              <p className="text-sm text-gray-600">Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {earnings?.payoutHistory?.filter(p => p.status === 'pending').length || 0}
              </div>
              <p className="text-sm text-gray-600">Pending Payouts</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorEarnings;
