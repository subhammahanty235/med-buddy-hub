
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { 
  sendMessage, 
  setMode, 
  updateNotes, 
  updateFeedback, 
  setTyping, 
  markSessionComplete,
  saveNotes 
} from '@/store/slices/communicationSlice';
import { 
  Send, 
  Paperclip, 
  Video, 
  MessageSquare, 
  Mic, 
  MicOff, 
  VideoIcon, 
  VideoOff, 
  PhoneOff, 
  Save,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface CommunicationPanelProps {
  userType: 'doctor' | 'patient';
}

const CommunicationPanel: React.FC<CommunicationPanelProps> = ({ userType }) => {
  const dispatch = useAppDispatch();
  const { currentSession, loading } = useAppSelector((state) => state.communication);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [message, setMessage] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentSession) return;

    await dispatch(sendMessage({
      sessionId: currentSession.id,
      content: message,
      sender: userType
    }));

    setMessage('');
  };

  const handleModeSwitch = (mode: 'chat' | 'video') => {
    dispatch(setMode(mode));
  };

  const handleNotesChange = (notes: string) => {
    dispatch(updateNotes(notes));
    setNotesSaved(false);
  };

  const handleSaveNotes = async () => {
    if (!currentSession) return;
    
    await dispatch(saveNotes({
      sessionId: currentSession.id,
      notes: currentSession.doctorNotes
    }));
    
    setNotesSaved(true);
    toast.success('Notes saved successfully');
    setTimeout(() => setNotesSaved(false), 3000);
  };

  const handleCompleteSession = () => {
    dispatch(markSessionComplete());
    toast.success('Consultation marked as complete');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">No active communication session</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Communication Area - Left Side (65-70%) */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          {/* Mode Switcher */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant={currentSession.mode === 'chat' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleModeSwitch('chat')}
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </Button>
                <Button
                  variant={currentSession.mode === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleModeSwitch('video')}
                  className="flex items-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>Video Call</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {userType === 'doctor' ? currentSession.patientName : currentSession.doctorName}
                </span>
              </div>
            </div>
          </div>

          {/* Communication Content */}
          <CardContent className="flex-1 flex flex-col p-0">
            {currentSession.mode === 'chat' ? (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentSession.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender === userType
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${
                            msg.sender === userType ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {msg.sender === userType && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ml-2 ${
                                msg.status === 'seen' ? 'bg-green-100 text-green-700' :
                                msg.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {msg.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {currentSession.isTyping && currentSession.typingUser !== userType && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || loading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Video Call UI */
              <div className="flex-1 bg-gray-900 relative flex items-center justify-center">
                {/* Mock Video Call Interface */}
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {userType === 'doctor' ? currentSession.patientName.charAt(0) : currentSession.doctorName.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {userType === 'doctor' ? currentSession.patientName : currentSession.doctorName}
                  </h3>
                  <p className="text-gray-300">Connected</p>
                </div>

                {/* Video Call Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <Button
                    variant={isAudioEnabled ? 'default' : 'destructive'}
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant={isVideoEnabled ? 'default' : 'destructive'}
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  >
                    {isVideoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleModeSwitch('chat')}
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Utility Panel - Right Side (30-35%) */}
      <div className="w-80 space-y-4">
        {userType === 'doctor' && (
          <>
            {/* Doctor Notes */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Doctor Notes</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={loading}
                    className="flex items-center space-x-1"
                  >
                    {notesSaved ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{notesSaved ? 'Saved' : 'Save'}</span>
                  </Button>
                </div>
                <Textarea
                  value={currentSession.doctorNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Add notes about the consultation..."
                  className="min-h-[120px] resize-none"
                />
              </CardContent>
            </Card>

            {/* Feedback Section */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Post-Consultation Feedback</h3>
                <Textarea
                  value={currentSession.feedback}
                  onChange={(e) => dispatch(updateFeedback(e.target.value))}
                  placeholder="Write feedback for the patient..."
                  className="min-h-[100px] resize-none"
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Session Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Session Actions</h3>
            <div className="space-y-3">
              {userType === 'doctor' && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast.info('Prescription feature coming soon')}
                  >
                    Send Prescription
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast.info('Summary generation coming soon')}
                  >
                    Generate Summary
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleCompleteSession}
                    disabled={currentSession.status === 'completed'}
                  >
                    {currentSession.status === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Consultation Complete
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </Button>
                </>
              )}
              
              {userType === 'patient' && (
                <div className="text-center text-gray-600">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">In consultation with<br/>{currentSession.doctorName}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunicationPanel;
