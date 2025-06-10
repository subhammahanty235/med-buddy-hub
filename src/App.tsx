
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
                <div>Profile Page - Coming Soon</div>
              </ProtectedRoute>
            } />
            <Route path="/doctor/support" element={
              <ProtectedRoute userType="doctor">
                <div>Support Page - Coming Soon</div>
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
