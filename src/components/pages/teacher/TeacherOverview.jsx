// src/components/Teacher/TeacherOverview.jsx
import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, FileText, Settings, Eye } from 'lucide-react';

const TeacherOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { students, subjects, marks, correctionRequests, employees } = useData();

  // Only show if all required data is loaded
  if (!user || !students || !subjects || !marks || !correctionRequests || !employees) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  // Find current teacher
  const currentTeacher = employees.find(e => (e.user?._id || e.user) === (user.id || user._id));

  // Teacher's assigned class IDs
  const assignedClassIds = currentTeacher?.assignedClasses
    ?.filter(ac => ac.class)
    .map(ac => ac.class?._id || ac.class) || [];

  // Filter students to only those in assigned classes
  const teacherStudents = students.filter(student => {
    const sId = student.class?._id || student.class;
    return sId && assignedClassIds.some(id => String(id) === String(sId));
  });

  // Teacher's active subjects from their assignments
  const teacherSubjects = currentTeacher?.assignedClasses
    ?.filter(ac => ac.subject)
    .map(ac => ac.subject) || [];

  // Marks entered by this teacher (mark.teacher is a ref to User)
  const teacherMarks = marks.filter(mark => (mark.teacher?._id || mark.teacher) === (user.id || user._id));

  // Correction requests are for THIS teacher's marks
  const receivedRequests = correctionRequests.filter(req => {
    const markTeacherId = req.mark?.teacher?._id || req.mark?.teacher;
    const isThisTeacher = markTeacherId === (user.id || user._id);
    return isThisTeacher && req.status === 'pending';
  });

  // Calculate average marks for teacher's entries
  const averageMarks = teacherMarks.length > 0
    ? Math.round(teacherMarks.reduce((sum, mark) => sum + mark.marks, 0) / teacherMarks.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Teaching Dashboard</h2>
        <p className="text-gray-600">Overview of your classes and recent activities</p>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Welcome back, {user.fullName}!</h3>
            <p className="text-green-100 mt-1">Ready to manage your classes and student progress</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{averageMarks}%</div>
            <div className="text-green-100">Class Average</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="My Subjects" value={teacherSubjects.length} icon={<BookOpen className="h-6 w-6 text-white" />} bg="bg-blue-500" />
        <StatCard label="Total Students" value={teacherStudents.length} icon={<Users className="h-6 w-6 text-white" />} bg="bg-green-500" />
        <StatCard label="Marks Entered" value={teacherMarks.length} icon={<FileText className="h-6 w-6 text-white" />} bg="bg-purple-500" />
        <StatCard label="Pending Requests" value={receivedRequests.length} icon={<Settings className="h-6 w-6 text-white" />} bg="bg-orange-500" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionBtn
            onClick={() => navigate('/teacher/marks-entry')}
            icon={<FileText className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />}
            label="Enter Marks"
            desc="Add student marks for exams"
            bg="hover:bg-blue-50 hover:border-blue-200"
          />
          <QuickActionBtn
            onClick={() => navigate('/teacher/view-marks')}
            icon={<Eye className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />}
            label="View Marks"
            desc="Review entered marks"
            bg="hover:bg-green-50 hover:border-green-200"
          />
          <QuickActionBtn
            onClick={() => navigate('/teacher/corrections')}
            icon={<Settings className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />}
            label="Corrections"
            desc="Handle correction requests"
            bg="hover:bg-orange-50 hover:border-orange-200"
          />
        </div>
      </div>
    </div>
  );
};

// Stats card component
function StatCard({ label, value, icon, bg }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bg}`}>{icon}</div>
      </div>
    </div>
  );
}

// Quick action button
function QuickActionBtn({ onClick, icon, label, desc, bg }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 border border-gray-200 rounded-lg transition-colors group text-left ${bg}`}
    >
      {icon}
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-500">{desc}</p>
    </button>
  );
}

export default TeacherOverview;
