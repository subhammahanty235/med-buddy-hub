
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIDoctors from "./pages/AIDoctors";
import Chat from "./pages/Chat";
import Visits from "./pages/Visits";
import NotFound from "./pages/NotFound";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorBookings from "./pages/doctor/DoctorBookings";
import DoctorCalendar from "./pages/doctor/DoctorCalendar";
import DoctorEarnings from "./pages/doctor/DoctorEarnings";
import DoctorFeedback from "./pages/doctor/DoctorFeedback";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorSupport from "./pages/doctor/DoctorSupport";
import CommunicationDemo from "./pages/CommunicationDemo";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminDoctorDetails from "./pages/admin/AdminDoctorDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFeedback from "./pages/admin/AdminFeedback";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute userType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/doctors" element={
              <ProtectedRoute userType="admin">
                <AdminDoctors />
              </ProtectedRoute>
            } />
            <Route path="/admin/doctors/:doctorId" element={
              <ProtectedRoute userType="admin">
                <AdminDoctorDetails />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute userType="admin">
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/feedback" element={
              <ProtectedRoute userType="admin">
                <AdminFeedback />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute userType="admin">
                <Navigate to="/admin/dashboard" />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute userType="admin">
                <Navigate to="/admin/dashboard" />
              </ProtectedRoute>
            } />
            
            {/* Patient Routes */}
            <Route path="/" element={
              <ProtectedRoute userType="patient">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/ai-doctors" element={
              <ProtectedRoute userType="patient">
                <AIDoctors />
              </ProtectedRoute>
            } />
            <Route path="/chat/:doctorId" element={
              <ProtectedRoute userType="patient">
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/visits" element={
              <ProtectedRoute userType="patient">
                <Visits />
              </ProtectedRoute>
            } />
            <Route path="/communication/patient" element={
              <ProtectedRoute userType="patient">
                <CommunicationDemo userType="patient" />
              </ProtectedRoute>
            } />
            <Route path="/blogs" element={
              <ProtectedRoute userType="patient">
                <Navigate to="/" />
              </ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute userType="patient">
                <Navigate to="/visits" />
              </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={
              <ProtectedRoute userType="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/doctor/bookings" element={
              <ProtectedRoute userType="doctor">
                <DoctorBookings />
              </ProtectedRoute>
            } />
            <Route path="/doctor/calendar" element={
              <ProtectedRoute userType="doctor">
                <DoctorCalendar />
              </ProtectedRoute>
            } />
            <Route path="/doctor/earnings" element={
              <ProtectedRoute userType="doctor">
                <DoctorEarnings />
              </ProtectedRoute>
            } />
            <Route path="/doctor/feedback" element={
              <ProtectedRoute userType="doctor">
                <DoctorFeedback />
              </ProtectedRoute>
            } />
            <Route path="/doctor/profile" element={
              <ProtectedRoute userType="doctor">
                <DoctorProfile />
              </ProtectedRoute>
            } />
            <Route path="/doctor/support" element={
              <ProtectedRoute userType="doctor">
                <DoctorSupport />
              </ProtectedRoute>
            } />
            <Route path="/doctor/communication" element={
              <ProtectedRoute userType="doctor">
                <CommunicationDemo userType="doctor" />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
