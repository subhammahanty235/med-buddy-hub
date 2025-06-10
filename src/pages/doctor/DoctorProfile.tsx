
import React, { useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Camera, 
  Save, 
  Upload, 
  Clock, 
  DollarSign, 
  FileText,
  Shield,
  Mail,
  Phone,
  MapPin,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medical.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Cardiology',
    experience: '12 years',
    location: 'New York, NY',
    bio: 'Experienced cardiologist specializing in preventive cardiology and heart disease management. Committed to providing comprehensive care to patients.',
    consultationFee: 150,
    rating: 4.8,
    totalConsultations: 1247,
    availableHours: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: false },
      sunday: { start: '10:00', end: '14:00', available: false }
    }
  });

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Medical License', status: 'verified', uploadDate: '2024-01-15' },
    { id: 2, name: 'Board Certification', status: 'verified', uploadDate: '2024-01-15' },
    { id: 3, name: 'Malpractice Insurance', status: 'pending', uploadDate: '2024-01-20' }
  ]);

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  const handleFileUpload = (documentType: string) => {
    // Simulate file upload
    toast.success(`${documentType} uploaded successfully`);
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
            <p className="text-gray-600">Manage your professional profile and settings</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-lg">SJ</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information */}
          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Professional Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={profileData.specialization}
                      onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      value={profileData.experience}
                      onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    value={profileData.consultationFee}
                    onChange={(e) => setProfileData({ ...profileData, consultationFee: Number(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
                
                {/* Stats Display */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-2xl font-bold text-blue-600">{profileData.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{profileData.totalConsultations}</div>
                    <p className="text-sm text-gray-600">Total Consultations</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">${profileData.consultationFee}</div>
                    <p className="text-sm text-gray-600">Per Consultation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability */}
          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Working Hours</span>
                </CardTitle>
                <CardDescription>Set your available hours for each day of the week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-24 font-medium capitalize">{day}</div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={profileData.availableHours[day as keyof typeof profileData.availableHours].start}
                        disabled={!isEditing || !profileData.availableHours[day as keyof typeof profileData.availableHours].available}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={profileData.availableHours[day as keyof typeof profileData.availableHours].end}
                        disabled={!isEditing || !profileData.availableHours[day as keyof typeof profileData.availableHours].available}
                        className="w-32"
                      />
                    </div>
                    <Badge 
                      variant={profileData.availableHours[day as keyof typeof profileData.availableHours].available ? "default" : "secondary"}
                    >
                      {profileData.availableHours[day as keyof typeof profileData.availableHours].available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Documents & Verification</span>
                </CardTitle>
                <CardDescription>Upload and manage your professional documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">Uploaded: {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={doc.status === 'verified' ? 'default' : 'secondary'}>
                        {doc.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFileUpload(doc.name)}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Re-upload
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Drop files here or click to upload new documents</p>
                  <Button variant="outline" className="mt-2">
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isEditing && (
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;
