import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ArrowLeft, 
  Search, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  BarChart3
} from 'lucide-react';
import { AttendanceRecord } from '../App';

interface AttendanceHistoryProps {
  history: AttendanceRecord[];
  onBack: () => void;
}

export function AttendanceHistory({ history, onBack }: AttendanceHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'pending'>('all');

  const filteredHistory = history.filter((record) => {
    const matchesSearch = record.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAttendanceStats = () => {
    const total = history.length;
    const present = history.filter(r => r.status === 'present').length;
    const absent = history.filter(r => r.status === 'absent').length;
    const pending = history.filter(r => r.status === 'pending').length;
    
    return { total, present, absent, pending };
  };

  const stats = getAttendanceStats();
  const attendanceRate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

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
            <h1 className="font-semibold text-gray-900">Attendance History</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">{attendanceRate}%</div>
              <p className="text-gray-600">Overall Attendance Rate</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-lg font-semibold text-gray-900">{stats.present}</div>
                <p className="text-xs text-gray-600">Present</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-lg font-semibold text-gray-900">{stats.absent}</div>
                <p className="text-xs text-gray-600">Absent</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-lg font-semibold text-gray-900">{stats.pending}</div>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          <div className="flex space-x-2">
            {(['all', 'present', 'absent', 'pending'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Records ({filteredHistory.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredHistory.length > 0 ? (
              <div className="space-y-1">
                {filteredHistory.map((record) => (
                  <div key={record.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{record.className}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })} • {record.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                    
                    {record.location && (
                      <p className="text-xs text-gray-500 flex items-center space-x-1">
                        <span>📍 {record.location}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">No records found</p>
                <p className="text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter' 
                    : 'Start attending classes to see your history'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>This Month</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { subject: 'Computer Science 101', attended: 8, total: 10, rate: 80 },
                  { subject: 'Mathematics', attended: 9, total: 10, rate: 90 },
                  { subject: 'Physics', attended: 6, total: 8, rate: 75 }
                ].map((subject, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{subject.subject}</p>
                      <p className="text-sm text-gray-600">{subject.attended}/{subject.total} classes</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        subject.rate >= 80 ? 'text-green-600' : 
                        subject.rate >= 70 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {subject.rate}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}