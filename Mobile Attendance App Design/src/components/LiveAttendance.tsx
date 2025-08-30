import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  ArrowLeft, 
  Users, 
  Clock,
  CheckCircle,
  MapPin,
  AlertTriangle,
  Download,
  UserPlus
} from 'lucide-react';
import { AttendanceSession, AttendanceRecord } from '../App';

interface LiveAttendanceProps {
  session: AttendanceSession | null;
  onBack: () => void;
}

export function LiveAttendance({ session, onBack }: LiveAttendanceProps) {
  const [liveAttendees, setLiveAttendees] = useState<AttendanceRecord[]>([]);
  const [suspiciousEntries, setSuspiciousEntries] = useState<string[]>([]);

  // Mock live updates
  useEffect(() => {
    if (!session) return;

    const mockStudents = [
      { name: 'Alex Johnson', id: '2021CS001' },
      { name: 'Sam Wilson', id: '2021CS002' },
      { name: 'Jordan Smith', id: '2021CS003' },
      { name: 'Casey Brown', id: '2021CS004' },
      { name: 'Taylor Anderson', id: '2021CS005' },
      { name: 'Morgan Lee', id: '2021CS006' },
      { name: 'Riley Parker', id: '2021CS007' },
      { name: 'Avery Davis', id: '2021CS008' },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < mockStudents.length) {
        const student = mockStudents[currentIndex];
        const newRecord: AttendanceRecord = {
          id: Date.now().toString() + currentIndex,
          studentId: student.id,
          studentName: student.name,
          className: session.className,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          status: 'present',
          location: `Building A, Room ${Math.floor(Math.random() * 300) + 100}`
        };

        setLiveAttendees(prev => [newRecord, ...prev]);

        // Randomly mark some entries as suspicious
        if (Math.random() > 0.8) {
          setSuspiciousEntries(prev => [...prev, newRecord.id]);
        }

        currentIndex++;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="p-6">
            <p className="text-gray-600 mb-4">No active session found</p>
            <Button onClick={onBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRemoveEntry = (recordId: string) => {
    setLiveAttendees(prev => prev.filter(record => record.id !== recordId));
    setSuspiciousEntries(prev => prev.filter(id => id !== recordId));
  };

  const handleSubmitAttendance = () => {
    // Show success message and navigate back
    alert('Attendance submitted successfully!');
    onBack();
  };

  const attendanceRate = Math.round((liveAttendees.length / 45) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="font-semibold text-gray-900">Live Attendance</h1>
            <Badge className="bg-green-100 text-green-700 border-green-200 animate-pulse">
              Live
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Session Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-900">{session.className}</h2>
                <p className="text-sm text-gray-600">
                  Started at {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{liveAttendees.length}</div>
                <p className="text-sm text-gray-600">Students</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Attendance: {attendanceRate}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-gray-600">Suspicious: {suspiciousEntries.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Live Updates</span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {liveAttendees.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {liveAttendees.map((record, index) => (
                  <div 
                    key={record.id} 
                    className={`p-4 border-b last:border-b-0 transition-all duration-500 ${
                      index === 0 ? 'bg-green-50 animate-pulse' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {record.studentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{record.studentName}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span>{record.studentId}</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{record.time}</span>
                            </span>
                          </div>
                          {record.location && (
                            <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{record.location}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {suspiciousEntries.includes(record.id) && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleRemoveEntry(record.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600">Waiting for students to scan...</p>
                <p className="text-sm text-gray-500 mt-1">
                  Students will appear here as they scan the QR code
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmitAttendance}
            size="lg"
            className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl shadow-lg"
            disabled={liveAttendees.length === 0}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Submit Attendance ({liveAttendees.length} students)
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" className="h-12">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="lg" className="h-12">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700">Session Active</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {liveAttendees.length}/45 attended
                </span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {attendanceRate}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}