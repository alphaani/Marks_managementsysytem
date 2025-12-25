import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import {
  GraduationCap, Users, UserCheck, BookOpen, Calendar,
  FileText, Settings, LogOut, Menu, X, Layout
} from 'lucide-react';

import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import EmployeeManagement from './EmployeeManagement';
import StudentManagement from './StudentManagement';
import SubjectManagement from './SubjectManagement';
import ExamManagement from './ExamManagement';
import MarksManagement from './MarksManagement';
import CorrectionRequests from './CorrectionRequests';
import ClassManagement from './ClassManagement';

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: GraduationCap, path: '/admin' },
  { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
  { id: 'employees', label: 'Employee Management', icon: UserCheck, path: '/admin/employees' },
  { id: 'classes', label: 'Class Management', icon: Layout, path: '/admin/classes' },
  { id: 'students', label: 'Student Management', icon: GraduationCap, path: '/admin/students' },
  { id: 'subjects', label: 'Subject Management', icon: BookOpen, path: '/admin/subjects' },
  { id: 'exams', label: 'Exam Management', icon: Calendar, path: '/admin/exams' },
  { id: 'marks', label: 'Marks Management', icon: FileText, path: '/admin/marks' },
  { id: 'corrections', label: 'Correction Requests', icon: Settings, path: '/admin/corrections' }
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Extra guard for user
  if (!user) return <div className="p-10 text-lg text-gray-500">Loading user info...</div>;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-full flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b shrink-0">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-800">Admin Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto pb-24">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <item.icon className="h-5 w-5 mr-3 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="shrink-0 p-6 border-t bg-white">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-medium uppercase">
                {user?.fullName ? user.fullName.charAt(0) : 'A'}
              </span>
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm border-b h-16 flex items-center shrink-0 w-full z-10">
          <div className="flex items-center justify-between w-full px-4 sm:px-6">
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate px-2">
              {menuItems.find(item => location.pathname === item.path)?.label || 'Dashboard'}
            </h1>
            <div className="hidden sm:block text-sm text-gray-500 truncate">
              Welcome, {user.fullName.split(' ')[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="subjects" element={<SubjectManagement />} />
              <Route path="exams" element={<ExamManagement />} />
              <Route path="marks" element={<MarksManagement />} />
              <Route path="corrections" element={<CorrectionRequests />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
