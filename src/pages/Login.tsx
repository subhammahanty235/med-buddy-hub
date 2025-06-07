
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loginWithEmail, signupWithEmail, loginWithOTP } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { Mail, Phone, Heart } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [otpForm, setOtpForm] = useState({
    phone: '',
    otp: '',
    showOtp: false,
  });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginWithEmail({ 
        email: emailForm.email, 
        password: emailForm.password 
      })).unwrap();
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(signupWithEmail({
        email: emailForm.email,
        password: emailForm.password,
        name: emailForm.name,
      })).unwrap();
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  const handleSendOTP = () => {
    if (!otpForm.phone) {
      toast.error('Please enter your phone number');
      return;
    }
    setOtpForm(prev => ({ ...prev, showOtp: true }));
    toast.success('OTP sent to your phone!');
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginWithOTP({
        phone: otpForm.phone,
        otp: otpForm.otp,
      })).unwrap();
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('OTP verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">HealthCare AI</h1>
          <p className="text-gray-600">Your trusted healthcare companion</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Tabs defaultValue="email" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="otp" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      OTP
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={emailForm.email}
                          onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={emailForm.password}
                          onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="otp">
                    <form onSubmit={handleOTPVerification} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={otpForm.phone}
                          onChange={(e) => setOtpForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 000-0000"
                          required
                        />
                      </div>
                      
                      {!otpForm.showOtp ? (
                        <Button type="button" onClick={handleSendOTP} className="w-full">
                          Send OTP
                        </Button>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                              id="otp"
                              type="text"
                              value={otpForm.otp}
                              onChange={(e) => setOtpForm(prev => ({ ...prev, otp: e.target.value }))}
                              placeholder="000000"
                              maxLength={6}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                          </Button>
                        </>
                      )}
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleEmailSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={emailForm.name}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={emailForm.password}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
