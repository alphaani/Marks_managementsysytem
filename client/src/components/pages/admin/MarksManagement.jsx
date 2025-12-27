// src/components/pages/admin/MarksManagement.jsx
import React, { useState } from 'react';
import { useData } from "../Context/DataContext";
import {
  FileText, TrendingUp, Award, AlertCircle, Search
} from 'lucide-react';

const MarksManagement = () => {
  const { marks, students, subjects, exams, users, classes: allClasses } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterExam, setFilterExam] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Use marks from context directly since they are already populated from backend
  const filteredMarks = marks.filter(mark => {
    // mark.student, mark.subject, mark.exam are populated objects
    const studentName = mark.student?.fullName || '';
    const studentClassId = mark.student?.class?._id || mark.student?.class;
    const subjectId = mark.subject?._id || mark.subject;
    const examId = mark.exam?._id || mark.exam;

    const matchesSearch = !searchTerm || studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || subjectId === filterSubject;
    const matchesExam = !filterExam || examId === filterExam;
    const matchesClass = !filterClass || studentClassId === filterClass;

    return matchesSearch && matchesSubject && matchesExam && matchesClass;
  });

  // Unique classes from students or from classes array
  // Use the 'classes' array from context for the dropdown
  const dropdownClasses = allClasses || [];

  // Statistics
  const totalMarks = filteredMarks.length;
  const averageMarks = totalMarks > 0 ? Math.round(filteredMarks.reduce((sum, mark) => sum + mark.marks, 0) / totalMarks) : 0;
  const highestMark = totalMarks > 0 ? Math.max(...filteredMarks.map(mark => mark.marks)) : 0;
  const lowestMark = totalMarks > 0 ? Math.min(...filteredMarks.map(mark => mark.marks)) : 0;

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Marks Management</h2>
        <p className="text-gray-600">View and analyze all student marks</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="Total Marks" value={totalMarks} icon={<FileText className="h-6 w-6 text-blue-600" />} bg="bg-blue-100" />
        <StatCard label="Average Score" value={`${averageMarks}%`} icon={<TrendingUp className="h-6 w-6 text-green-600" />} bg="bg-green-100" />
        <StatCard label="Highest Score" value={`${highestMark}%`} icon={<Award className="h-6 w-6 text-yellow-600" />} bg="bg-yellow-100" />
        <StatCard label="Lowest Score" value={`${lowestMark}%`} icon={<AlertCircle className="h-6 w-6 text-red-600" />} bg="bg-red-100" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Search student..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Subject</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id || subject.id} value={subject._id || subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Exam</label>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Exams</option>
              {exams.map(exam => (
                <option key={exam._id || exam.id} value={exam._id || exam.id}>{exam.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Class</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {dropdownClasses.map(cls => (
                <option key={cls._id || cls.id} value={cls._id || cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Student</Th>
                <Th>Subject</Th>
                <Th>Exam</Th>
                <Th>Marks</Th>
                <Th>Grade</Th>
                <Th>Entered By</Th>
                <Th>Entry Date</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMarks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-10 w-10 text-gray-300 mb-2" />
                      <p>No marks found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMarks.map((mark) => {
                  const student = mark.student;
                  const subject = mark.subject;
                  const exam = mark.exam;
                  const teacher = mark.teacher; // Expected to be populated User object
                  return (
                    <tr key={mark._id || mark.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium text-sm">
                              {student?.fullName?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student?.fullName || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{student?.class?.name || 'No Class'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{subject?.name || '-'}</div>
                        <div className="text-xs text-gray-500">{subject?.code || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{exam?.name || '-'}</div>
                        <div className="text-xs text-gray-500">{exam?.type || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xl font-bold ${mark.marks >= 80 ? 'text-green-600' :
                            mark.marks >= 60 ? 'text-yellow-600' :
                              'text-red-500'
                          }`}>
                          {mark.marks}
                        </span>
                        <span className="text-gray-400 text-xs ml-1">/ 100</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${mark.marks >= 80 ? 'bg-green-100 text-green-800' :
                            mark.marks >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {getGrade(mark.marks)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {teacher?.fullName || 'System'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mark.entryDate ? new Date(mark.entryDate).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function StatCard({ label, value, icon, bg }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-b-4 border-transparent hover:border-blue-500 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">
      {children}
    </th>
  );
}

export default MarksManagement;
