import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { CRDashboard } from './components/CRDashboard';
import { QRScanner } from './components/QRScanner';
import { QRGenerator } from './components/QRGenerator';
import { AttendanceHistory } from './components/AttendanceHistory';
import { LiveAttendance } from './components/LiveAttendance';
import { Reports } from './components/Reports';

export type UserRole = 'student' | 'teacher' | 'cr';
export type Screen = 
  | 'login' 
  | 'dashboard' 
  | 'qr-scanner' 
  | 'qr-generator' 
  | 'attendance-history' 
  | 'live-attendance' 
  | 'reports';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  collegeId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  time: string;
  status: 'present' | 'absent' | 'pending';
  location?: string;
}

export interface AttendanceSession {
  id: string;
  className: string;
  teacherId: string;
  qrCode: string;
  expiresAt: Date;
  isActive: boolean;
  attendees: AttendanceRecord[];
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);

  // Mock data for development
  useEffect(() => {
    const mockHistory: AttendanceRecord[] = [
      {
        id: '1',
        studentId: '2021CS001',
        studentName: 'John Doe',
        className: 'Computer Science 101',
        date: '2024-01-20',
        time: '10:32 AM',
        status: 'present'
      },
      {
        id: '2',
        studentId: '2021CS001',
        studentName: 'John Doe',
        className: 'Mathematics',
        date: '2024-01-19',
        time: '09:15 AM',
        status: 'present'
      },
      {
        id: '3',
        studentId: '2021CS001',
        studentName: 'John Doe',
        className: 'Physics',
        date: '2024-01-18',
        time: '11:45 AM',
        status: 'absent'
      }
    ];
    setAttendanceHistory(mockHistory);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
    setActiveSession(null);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleStartSession = (className: string) => {
    if (user?.role === 'teacher') {
      const session: AttendanceSession = {
        id: Date.now().toString(),
        className,
        teacherId: user.id,
        qrCode: `attendance-${Date.now()}`,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        isActive: true,
        attendees: []
      };
      setActiveSession(session);
      setCurrentScreen('qr-generator');
    }
  };

  const handleScanSuccess = (qrData: string) => {
    if (user?.role === 'student' && activeSession) {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        studentId: user.collegeId,
        studentName: user.name,
        className: activeSession.className,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        status: 'present'
      };
      
      setAttendanceHistory(prev => [newRecord, ...prev]);
      setCurrentScreen('dashboard');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      
      case 'dashboard':
        if (!user) return <LoginScreen onLogin={handleLogin} />;
        
        switch (user.role) {
          case 'student':
            return (
              <StudentDashboard
                user={user}
                attendanceHistory={attendanceHistory}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            );
          case 'teacher':
            return (
              <TeacherDashboard
                user={user}
                activeSession={activeSession}
                onNavigate={handleNavigate}
                onStartSession={handleStartSession}
                onLogout={handleLogout}
              />
            );
          case 'cr':
            return (
              <CRDashboard
                user={user}
                activeSession={activeSession}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            );
          default:
            return <LoginScreen onLogin={handleLogin} />;
        }
      
      case 'qr-scanner':
        return (
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onBack={() => handleNavigate('dashboard')}
          />
        );
      
      case 'qr-generator':
        return (
          <QRGenerator
            session={activeSession}
            onBack={() => handleNavigate('dashboard')}
            onSessionEnd={() => {
              setActiveSession(null);
              handleNavigate('dashboard');
            }}
          />
        );
      
      case 'attendance-history':
        return (
          <AttendanceHistory
            history={attendanceHistory}
            onBack={() => handleNavigate('dashboard')}
          />
        );
      
      case 'live-attendance':
        return (
          <LiveAttendance
            session={activeSession}
            onBack={() => handleNavigate('dashboard')}
          />
        );
      
      case 'reports':
        return (
          <Reports
            attendanceData={attendanceHistory}
            onBack={() => handleNavigate('dashboard')}
          />
        );
      
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
    </div>
  );
}