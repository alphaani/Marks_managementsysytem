import React from 'react';
// import React, { useState } from 'react';
import { useData } from '../Context/DataContext';
// import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  // BookOpen, 
  FileText, 
  Settings, 
  // LogOut,
  // Menu,
  // X,
  // Plus,
  // Edit,
  // Trash2,
  // Search,
  // Eye,
  // Check,
  // XCircle,
  // TrendingUp,
  // Award,
  // Calendar,
  AlertCircle
} from 'lucide-react';

// ...copy AdminOverview code here
// Admin Overview Component
const AdminOverview = () => {
  const { users, students, employees, subjects, exams, marks, correctionRequests } = useData();

  const stats = {
    totalUsers: users.length,
    totalStudents: students.length,
    totalEmployees: employees.length,
    totalSubjects: subjects.length,
    totalExams: exams.length,
    totalMarks: marks.length,
    pendingCorrections: correctionRequests.filter(req => req.status === 'teacher_approved').length,
    activeUsers: users.filter(user => user.status === 'active').length
  };

  // const recentActivities = [
  //   { id: 1, type: 'user_created', description: 'New user account created for John Doe', time: '2 hours ago' },
  //   { id: 2, type: 'correction_approved', description: 'Correction request approved for Mathematics', time: '4 hours ago' },
  //   { id: 3, type: 'exam_created', description: 'New exam "Final Exam" created', time: '1 day ago' },
  //   { id: 4, type: 'marks_entered', description: '25 new marks entries added', time: '2 days ago' }
  // ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h2>
        <p className="text-gray-600">Complete overview of the student marks management system</p>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">System Administrator</h3>
            <p className="text-blue-100 mt-1">Manage all aspects of the academic system</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.activeUsers}</div>
            <div className="text-blue-100">Active Users</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEmployees}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Corrections</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingCorrections}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>


      

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/admin/users'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group"
          >
            <Users className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-500">Add or edit user accounts</p>
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/students'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors group"
          >
            <GraduationCap className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-gray-900">Manage Students</p>
            <p className="text-sm text-gray-500">Student profiles and data</p>
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/corrections'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors group"
          >
            <Settings className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-gray-900">Corrections</p>
            <p className="text-sm text-gray-500">Review correction requests</p>
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/marks'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors group"
          >
            <FileText className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-gray-900">View Marks</p>
            <p className="text-sm text-gray-500">All student marks</p>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminOverview;