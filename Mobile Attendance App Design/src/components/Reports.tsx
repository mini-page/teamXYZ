import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Download, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  FileText
} from 'lucide-react';
import { AttendanceRecord } from '../App';

interface ReportsProps {
  attendanceData: AttendanceRecord[];
  onBack: () => void;
}

export function Reports({ attendanceData, onBack }: ReportsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedClass, setSelectedClass] = useState('all');

  // Mock additional data for comprehensive reports
  const classData = [
    { name: 'Computer Science 101', totalClasses: 20, attended: 18, percentage: 90 },
    { name: 'Mathematics', totalClasses: 18, attended: 16, percentage: 89 },
    { name: 'Physics', totalClasses: 15, attended: 11, percentage: 73 },
    { name: 'Web Development', totalClasses: 12, attended: 12, percentage: 100 }
  ];

  const weeklyData = [
    { week: 'Week 1', attendance: 85 },
    { week: 'Week 2', attendance: 92 },
    { week: 'Week 3', attendance: 78 },
    { week: 'Week 4', attendance: 88 }
  ];

  const topStudents = [
    { name: 'Alex Johnson', id: '2021CS001', percentage: 98 },
    { name: 'Sam Wilson', id: '2021CS002', percentage: 96 },
    { name: 'Jordan Smith', id: '2021CS003', percentage: 94 }
  ];

  const getOverallStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(r => r.status === 'present').length;
    const absent = attendanceData.filter(r => r.status === 'absent').length;
    
    const currentMonth = new Date().getMonth();
    const thisMonthData = attendanceData.filter(r => new Date(r.date).getMonth() === currentMonth);
    const lastMonthData = attendanceData.filter(r => new Date(r.date).getMonth() === currentMonth - 1);
    
    const thisMonthRate = thisMonthData.length > 0 ? 
      (thisMonthData.filter(r => r.status === 'present').length / thisMonthData.length) * 100 : 0;
    const lastMonthRate = lastMonthData.length > 0 ? 
      (lastMonthData.filter(r => r.status === 'present').length / lastMonthData.length) * 100 : 0;
    
    return {
      total,
      present,
      absent,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      trend: thisMonthRate - lastMonthRate
    };
  };

  const stats = getOverallStats();

  const handleExport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

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
            <h1 className="font-semibold text-gray-900">Reports & Analytics</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="semester">This Semester</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="cs101">Computer Science 101</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Overall Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary mb-2">{stats.percentage}%</div>
              <p className="text-gray-600">Average Attendance</p>
              
              <div className="flex items-center justify-center mt-2">
                {stats.trend > 0 ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+{stats.trend.toFixed(1)}% from last month</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm">{stats.trend.toFixed(1)}% from last month</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{stats.total}</div>
                <p className="text-sm text-gray-600">Total Classes</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-green-600">{stats.present}</div>
                <p className="text-sm text-gray-600">Attended</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-red-600">{stats.absent}</div>
                <p className="text-sm text-gray-600">Missed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Weekly Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyData.map((week, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{week.week}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${week.attendance}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${
                      week.attendance >= 80 ? 'text-green-600' :
                      week.attendance >= 70 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {week.attendance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class-wise Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Class Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {classData.map((classItem, index) => (
                <div key={index} className="p-4 border-b last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                      <p className="text-sm text-gray-600">
                        {classItem.attended}/{classItem.totalClasses} classes
                      </p>
                    </div>
                    <Badge className={
                      classItem.percentage >= 90 ? 'bg-green-100 text-green-700 border-green-200' :
                      classItem.percentage >= 75 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    }>
                      {classItem.percentage}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        classItem.percentage >= 90 ? 'bg-green-500' :
                        classItem.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${classItem.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers (Only show for teachers) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-amber-100 text-amber-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.id}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    {student.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Export Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleExport('csv')}
                className="h-12"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
                className="h-12"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3 text-center">
              Reports include detailed attendance data and analytics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}