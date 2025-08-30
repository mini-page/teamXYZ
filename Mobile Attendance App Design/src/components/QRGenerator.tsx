import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Eye,
  RotateCcw,
  Square,
  CheckCircle
} from 'lucide-react';
import { AttendanceSession } from '../App';

interface QRGeneratorProps {
  session: AttendanceSession | null;
  onBack: () => void;
  onSessionEnd: () => void;
}

export function QRGenerator({ session, onBack, onSessionEnd }: QRGeneratorProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [qrRotation, setQrRotation] = useState(0);

  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate gradual attendee increase
    const attendeeTimer = setInterval(() => {
      setAttendeeCount((prev) => {
        const random = Math.random();
        if (random > 0.7) {
          return Math.min(prev + 1, 45); // Max 45 students
        }
        return prev;
      });
    }, 3000);

    // QR code rotation animation
    const rotationTimer = setInterval(() => {
      setQrRotation((prev) => (prev + 90) % 360);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(attendeeTimer);
      clearInterval(rotationTimer);
    };
  }, [session, onSessionEnd]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="p-6">
            <p className="text-gray-600">No active session found</p>
            <Button onClick={onBack} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeProgress = () => {
    return ((600 - timeLeft) / 600) * 100;
  };

  const getTimeColor = () => {
    if (timeLeft > 300) return 'text-green-600';
    if (timeLeft > 120) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    if (timeLeft > 300) return 'bg-green-500';
    if (timeLeft > 120) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Generate QR code pattern (visual representation)
  const generateQRPattern = () => {
    const pattern = [];
    for (let i = 0; i < 21; i++) {
      const row = [];
      for (let j = 0; j < 21; j++) {
        // Create a pseudo-random pattern based on session ID and position
        const seed = session.id.charCodeAt(0) + i * j + Date.now();
        row.push(seed % 3 === 0);
      }
      pattern.push(row);
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="font-semibold text-gray-900">Attendance Session</h1>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Session Info */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-gray-900 mb-2">{session.className}</h2>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{attendeeCount} students scanned</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Started {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Timer */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium text-gray-900">Time Remaining</span>
            </div>
            <div className={`text-4xl font-bold mb-4 ${getTimeColor()}`}>
              {formatTime(timeLeft)}
            </div>
            <Progress 
              value={getTimeProgress()} 
              className="h-2 mb-4"
            />
            <p className="text-sm text-gray-600">
              QR code will expire automatically
            </p>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="bg-white shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Square className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-900">Scan This QR Code</span>
              </div>
              <p className="text-sm text-gray-600">Students should scan this code to mark attendance</p>
            </div>
            
            {/* QR Code Display */}
            <div 
              className="w-48 h-48 mx-auto bg-white border-4 border-gray-200 rounded-xl p-4 transition-transform duration-1000"
              style={{ transform: `rotate(${qrRotation}deg)` }}
            >
              <div className="w-full h-full grid grid-cols-21 gap-0 rounded-lg overflow-hidden">
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
            
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
              <RotateCcw className="w-3 h-3" />
              <span>QR code rotates every 5 seconds</span>
            </div>
          </CardContent>
        </Card>

        {/* Live Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{attendeeCount}</div>
              <p className="text-sm text-gray-600">Students Attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{Math.round((attendeeCount / 45) * 100)}%</div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 border-primary text-primary hover:bg-primary/5"
            onClick={() => {
              // Navigate to live attendance view
            }}
          >
            <Eye className="w-5 h-5 mr-2" />
            View Live Attendance List
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            className="w-full h-12"
            onClick={onSessionEnd}
          >
            End Session
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 pt-4">
          <p>Keep this screen visible for students to scan</p>
          <p>Session will auto-end when timer expires</p>
        </div>
      </div>
    </div>
  );
}