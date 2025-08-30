import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Play, 
  Users, 
  BarChart3, 
  LogOut, 
  Clock,
  BookOpen,
  QrCode,
  Eye,
  Plus
} from 'lucide-react';
import { User as UserType, AttendanceSession, Screen } from '../App';

interface TeacherDashboardProps {
  user: UserType;
  activeSession: AttendanceSession | null;
  onNavigate: (screen: Screen) => void;
  onStartSession: (className: string) => void;
  onLogout: () => void;
}

export function TeacherDashboard({ 
  user, 
  activeSession, 
  onNavigate, 
  onStartSession, 
  onLogout 
}: TeacherDashboardProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const todayClasses = [
    { id: '1', name: 'Computer Science 101', time: '10:00 AM', students: 45, attended: 0, room: 'CS-201' },
    { id: '2', name: 'Data Structures', time: '2:00 PM', students: 38, attended: 35, room: 'CS-105' },
    { id: '3', name: 'Web Development', time: '4:00 PM', students: 32, attended: 0, room: 'LAB-2' }
  ];

  const handleCreateSession = () => {
    if (!newClassName.trim()) return;
    
    onStartSession(newClassName.trim());
    setNewClassName('');
    setIsCreateDialogOpen(false);
  };

  const getAttendancePercentage = (attended: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((attended / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
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
        {/* Active Session Alert */}
        {activeSession && (
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="font-medium text-green-800">Session Active</p>
                  <p className="text-sm text-green-600">{activeSession.className}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onNavigate('live-attendance')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Attendance Session */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Attendance Session</h2>
            <p className="text-gray-600 mb-6">Generate QR code for students to scan</p>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl shadow-lg"
                  disabled={!!activeSession}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {activeSession ? 'Session in Progress' : 'Start New Session'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Create Attendance Session</DialogTitle>
                  <DialogDescription>
                    Enter the class name to generate a QR code for student attendance.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="className">Class Name</Label>
                    <Input
                      id="className"
                      placeholder="e.g., Computer Science 101"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <Button
                    onClick={handleCreateSession}
                    disabled={!newClassName.trim()}
                    className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    Generate QR Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Today's Classes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {todayClasses.map((classItem) => (
                <div key={classItem.id} className="p-4 border-b last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                      <p className="text-sm text-gray-600">{classItem.time} • {classItem.room}</p>
                    </div>
                    {classItem.attended > 0 && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {getAttendancePercentage(classItem.attended, classItem.students)}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{classItem.attended}/{classItem.students} attended</span>
                    </span>
                    {classItem.attended === 0 ? (
                      <Badge variant="outline" className="text-gray-500">
                        Not Started
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Live Attendance</h3>
              <p className="text-sm text-gray-600 mb-3">Monitor active sessions</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigate('live-attendance')}
                disabled={!activeSession}
                className="w-full"
              >
                View Live
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Reports</h3>
              <p className="text-sm text-gray-600 mb-3">View analytics</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigate('reports')}
                className="w-full"
              >
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex justify-around">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2 text-primary">
                <BookOpen className="w-5 h-5 mb-1" />
                <span className="text-xs">Classes</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-col h-auto py-2"
                onClick={() => onNavigate('live-attendance')}
              >
                <Eye className="w-5 h-5 mb-1" />
                <span className="text-xs">Live</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-col h-auto py-2"
                onClick={() => onNavigate('reports')}
              >
                <BarChart3 className="w-5 h-5 mb-1" />
                <span className="text-xs">Reports</span>
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