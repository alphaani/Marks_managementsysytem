import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { FileText, TrendingUp, Award, AlertCircle } from "lucide-react";

const StudentOverview = () => {
  const { user } = useAuth();
  const { students, marks, correctionRequests } = useData();

  // Find current student
  const currentStudent = students.find(s => (s.user?._id || s.user?.id) === (user.id || user._id));

  // Filter for student marks
  const studentMarks = marks.filter(mark => {
    const markStudentId = mark.student?._id || mark.student;
    const currentStudentId = currentStudent?._id || currentStudent?.id;
    return markStudentId === currentStudentId;
  });

  // Filter for student correction requests
  // correctionRequests populate 'mark', and mark populates 'student'
  const studentRequests = correctionRequests.filter(req => {
    const markStudentId = req.mark?.student?._id || req.mark?.student;
    const currentStudentId = currentStudent?._id || currentStudent?.id;
    return markStudentId === currentStudentId;
  });

  // Calculate statistics
  const totalMarks = studentMarks.length;
  const averageMarks = totalMarks > 0 ? Math.round(studentMarks.reduce((sum, mark) => sum + mark.marks, 0) / totalMarks) : 0;
  const highestMark = totalMarks > 0 ? Math.max(...studentMarks.map(mark => mark.marks)) : 0;
  const pendingRequests = studentRequests.filter(req => req.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Academic Dashboard</h2>
        <p className="text-gray-600">Overview of your academic performance and activities</p>
      </div>

      {/* Student Info Card */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{currentStudent?.fullName}</h3>
            <p className="text-purple-100">Class: {currentStudent?.class?.name || currentStudent?.class || 'N/A'}</p>
            <p className="text-purple-100">Academic Year: {currentStudent?.academicYear || 'N/A'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{averageMarks}%</div>
            <div className="text-purple-100">Average Score</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="Total Exams" value={totalMarks} icon={<FileText className="h-6 w-6 text-white" />} bg="bg-blue-500" />
        <StatCard label="Average Score" value={`${averageMarks}%`} icon={<TrendingUp className="h-6 w-6 text-white" />} bg="bg-green-500" />
        <StatCard label="Highest Score" value={`${highestMark}%`} icon={<Award className="h-6 w-6 text-white" />} bg="bg-yellow-500" />
        <StatCard label="Pending Requests" value={pendingRequests} icon={<AlertCircle className="h-6 w-6 text-white" />} bg="bg-orange-500" />
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

export default StudentOverview;
