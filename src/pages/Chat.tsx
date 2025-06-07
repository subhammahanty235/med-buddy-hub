
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addUserMessage, sendMessageToAI, setCurrentSession } from '@/store/slices/chatSlice';
import { Send, Image, ArrowLeft, Bot, User } from 'lucide-react';
import { toast } from 'sonner';

const Chat = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentSession, loading } = useAppSelector((state) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (doctorId && currentSession?.doctorId !== doctorId) {
      // Find existing session or redirect if none exists
      // For now, redirect to AI doctors page
      navigate('/ai-doctors');
    }
  }, [doctorId, currentSession, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !imageFile) return;
    if (!currentSession) return;

    const imageDataUrl = imageFile ? await fileToDataUrl(imageFile) : undefined;

    // Add user message to chat
    dispatch(addUserMessage({
      sessionId: currentSession.id,
      message: message || '[Image uploaded]',
      image: imageDataUrl
    }));

    // Send to AI
    try {
      await dispatch(sendMessageToAI({
        sessionId: currentSession.id,
        message,
        image: imageDataUrl
      })).unwrap();
    } catch (error) {
      toast.error('Failed to send message');
    }

    // Clear input
    setMessage('');
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      toast.success('Image selected');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentSession) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <p className="text-gray-600">No chat session found. Please start a new conversation.</p>
          <Button onClick={() => navigate('/ai-doctors')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Doctors
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/ai-doctors')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span>AI {currentSession.doctorName}</span>
                </CardTitle>
                <p className="text-sm text-gray-600">{currentSession.specialization} Specialist</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentSession.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {msg.sender === 'ai' && (
                      <Bot className="h-4 w-4 mt-1 text-blue-600" />
                    )}
                    {msg.sender === 'user' && (
                      <User className="h-4 w-4 mt-1 text-white" />
                    )}
                    <div className="flex-1">
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Uploaded"
                          className="max-w-full h-auto rounded mb-2"
                        />
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4">
            {imageFile && (
              <div className="mb-3 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-600">Image: {imageFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImageFile(null)}
                >
                  Remove
                </Button>
              </div>
            )}
            
            <div className="flex space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (You can also ask for a list of doctors for your issue)"
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={(!message.trim() && !imageFile) || loading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Chat;
