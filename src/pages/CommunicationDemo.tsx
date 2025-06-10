
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import DoctorLayout from '@/components/DoctorLayout';
import CommunicationPanel from '@/components/CommunicationPanel';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { startCommunicationSession } from '@/store/slices/communicationSlice';
import { Button } from '@/components/ui/button';

interface CommunicationDemoProps {
  userType: 'doctor' | 'patient';
}

const CommunicationDemo: React.FC<CommunicationDemoProps> = ({ userType }) => {
  const dispatch = useAppDispatch();
  const { currentSession, loading } = useAppSelector((state) => state.communication);

  const startSession = () => {
    dispatch(startCommunicationSession({
      doctorId: 'doctor_1',
      patientId: 'patient_1',
      appointmentType: 'chat'
    }));
  };

  const LayoutComponent = userType === 'doctor' ? DoctorLayout : Layout;

  return (
    <LayoutComponent>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Communication Panel - {userType === 'doctor' ? 'Doctor' : 'Patient'} View
          </h1>
          <p className="text-gray-600">
            Real-time communication panel with chat and video call support
          </p>
        </div>

        {!currentSession ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No Active Session</h2>
            <p className="text-gray-600 mb-6">Start a communication session to begin</p>
            <Button onClick={startSession} disabled={loading}>
              {loading ? 'Starting Session...' : 'Start Demo Session'}
            </Button>
          </div>
        ) : (
          <CommunicationPanel userType={userType} />
        )}
      </div>
    </LayoutComponent>
  );
};

export default CommunicationDemo;
