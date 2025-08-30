import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Monitor, 
  LogOut, 
  Clock,
  Users,
  Eye,
  Square,
  AlertCircle
} from 'lucide-react';
import { User as UserType, AttendanceSession, Screen } from '../App';

interface CRDashboardProps {
  user: UserType;
  activeSession: AttendanceSession | null;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function CRDashboard({ 
  user, 
  activeSession, 
  onNavigate, 
  onLogout 
}: CRDashboardProps) {
  const [displayMode, setDisplayMode] = useState<'waiting' | 'displaying'>('waiting');

  // Generate QR pattern for display
  const generateQRPattern = () => {
    if (!activeSession) return [];
    
    const pattern = [];
    for (let i = 0; i < 25; i++) {
      const row = [];
      for (let j = 0; j < 25; j++) {
        const seed = activeSession.id.charCodeAt(0) + i * j;
        row.push(seed % 3 === 0);
      }
      pattern.push(row);
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  if (displayMode === 'displaying' && activeSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        {/* Fullscreen QR Display */}
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeSession.className}</h1>
              <p className="text-gray-600">Scan this QR code to mark attendance</p>
            </div>
            
            {/* Large QR Code */}
            <div className="w-72 h-72 mx-auto bg-white border-4 border-gray-200 rounded-2xl p-4 mb-6">
              <div className="w-full h-full grid grid-cols-25 gap-0 rounded-lg overflow-hidden">
                {qrPattern.map((row, i) => 
                  row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`w-full h-full ${cell ? 'bg-black' : 'bg-white'}`}
                    />
                  ))
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Valid until session ends</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Class Representative Display</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => setDisplayMode('waiting')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            Exit Display Mode
          </Button>
          
          {/* Watermark */}
          <div className="absolute bottom-4 left-4 text-xs text-gray-400">
            AttendanceApp • Do not screenshot
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-600">Class Representative • {user.collegeId}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Active Session */}
        {activeSession ? (
          <Card className="border-2 border-accent/20 bg-gradient-to-br from-amber-50 to-orange-100">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">QR Code Ready</h2>
              <p className="text-gray-600 mb-2">Session: <strong>{activeSession.className}</strong></p>
              <p className="text-sm text-gray-600 mb-6">Teacher has sent you a QR code to display</p>
              <Button 
                onClick={() => setDisplayMode('displaying')}
                size="lg" 
                className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-lg"
              >
                <Monitor className="w-5 h-5 mr-2" />
                Display QR Code
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Session</h2>
              <p className="text-gray-600 mb-6">Waiting for teacher to start attendance session</p>
              <div className="text-sm text-gray-500">
                <p>Teachers will send QR codes for you to display</p>
                <p className="mt-1">You'll be notified when a session starts</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-primary" />
              <span>How It Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Wait for Teacher</h3>
                <p className="text-sm text-gray-600">Teacher will start an attendance session and send you the QR code</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Display QR Code</h3>
                <p className="text-sm text-gray-600">Tap "Display QR Code" to show it fullscreen for students to scan</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Monitor Session</h3>
                <p className="text-sm text-gray-600">Keep the QR code visible until the teacher ends the session</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Recent Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 1, class: 'Computer Science 101', date: 'Today, 10:30 AM', status: 'completed' },
                { id: 2, class: 'Mathematics', date: 'Yesterday, 2:15 PM', status: 'completed' },
                { id: 3, class: 'Physics', date: 'Jan 18, 11:45 AM', status: 'completed' }
              ].map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{session.class}</h3>
                    <p className="text-sm text-gray-600">{session.date}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex justify-around">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2 text-primary">
                <Monitor className="w-5 h-5 mb-1" />
                <span className="text-xs">Display</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <Clock className="w-5 h-5 mb-1" />
                <span className="text-xs">History</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <Users className="w-5 h-5 mb-1" />
                <span className="text-xs">Help</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom spacing for fixed nav */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}