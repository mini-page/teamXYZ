import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { GraduationCap, User, Users } from 'lucide-react';
import { User as UserType, UserRole } from '../App';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [collegeId, setCollegeId] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'student' as UserRole,
      label: 'Student',
      description: 'Mark attendance by scanning QR codes',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'teacher' as UserRole,
      label: 'Teacher',
      description: 'Generate QR codes and manage attendance',
      icon: User,
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'cr' as UserRole,
      label: 'Class Representative',
      description: 'Display QR codes for class attendance',
      icon: Users,
      color: 'bg-amber-100 text-amber-700 border-amber-200'
    }
  ];

  const handleLogin = () => {
    if (!collegeId || !selectedRole) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user: UserType = {
        id: Date.now().toString(),
        name: getNameFromId(collegeId, selectedRole),
        role: selectedRole,
        collegeId
      };
      
      onLogin(user);
      setIsLoading(false);
    }, 1000);
  };

  const getNameFromId = (id: string, role: UserRole): string => {
    // Mock name generation based on ID and role
    const names = {
      student: ['Alex Johnson', 'Sam Wilson', 'Jordan Smith', 'Casey Brown'],
      teacher: ['Dr. Emily Davis', 'Prof. Michael Chen', 'Dr. Sarah Wilson'],
      cr: ['Taylor Anderson', 'Morgan Lee', 'Riley Parker']
    };
    
    const roleNames = names[role];
    const index = id.length % roleNames.length;
    return roleNames[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to mark your attendance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="collegeId" className="text-gray-700">College ID</Label>
            <Input
              id="collegeId"
              type="text"
              placeholder="Enter your college ID"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700">Select your role</Label>
            <div className="grid gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedRole === role.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{role.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                      </div>
                      {selectedRole === role.id && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={!collegeId || !selectedRole || isLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Having trouble? Contact your administrator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}