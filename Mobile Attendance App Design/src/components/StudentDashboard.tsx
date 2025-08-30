import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  QrCode, 
  History, 
  User, 
  LogOut, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { User as UserType, AttendanceRecord, Screen } from '../App';

interface StudentDashboardProps {
  user: UserType;
  attendanceHistory: AttendanceRecord[];
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function StudentDashboard({ 
  user, 
  attendanceHistory, 
  onNavigate, 
  onLogout 
}: StudentDashboardProps) {
  const todayClasses = [
    { id: '1', name: 'Computer Science 101', time: '10:00 AM', room: 'CS-201', status: 'upcoming' },
    { id: '2', name: 'Mathematics', time: '2:00 PM', room: 'MATH-105', status: 'present' },
    { id: '3', name: 'Physics', time: '4:00 PM', room: 'PHY-301', status: 'upcoming' }
  ];

  const recentAttendance = attendanceHistory.slice(0, 4);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Absent</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-gray-600">Upcoming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-600">{user.collegeId}</p>
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
        {/* QR Scan Button */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to Mark Attendance?</h2>
            <p className="text-gray-600 mb-6">Scan the QR code displayed by your teacher</p>
            <Button 
              onClick={() => onNavigate('qr-scanner')}
              size="lg" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Today's Classes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {todayClasses.map((classItem) => (
                <div key={classItem.id} className="p-4 border-b last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                      <p className="text-sm text-gray-600">{classItem.time} • {classItem.room}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(classItem.status)}
                      {getStatusBadge(classItem.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5 text-primary" />
                <span>Recent Attendance</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('attendance-history')}
                className="text-primary hover:text-primary/80"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentAttendance.length > 0 ? (
              <div className="space-y-1">
                {recentAttendance.map((record) => (
                  <div key={record.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{record.className}</h3>
                        <p className="text-sm text-gray-600">{record.date} • {record.time}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <History className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600">No attendance records yet</p>
                <p className="text-sm text-gray-500 mt-1">Start scanning QR codes to see your history</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex justify-around">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <User className="w-5 h-5 mb-1" />
                <span className="text-xs">Profile</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-col h-auto py-2 text-primary"
                onClick={() => onNavigate('attendance-history')}
              >
                <History className="w-5 h-5 mb-1" />
                <span className="text-xs">History</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-col h-auto py-2"
                onClick={() => onNavigate('qr-scanner')}
              >
                <QrCode className="w-5 h-5 mb-1" />
                <span className="text-xs">Scan</span>
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