// src/components/Teacher/ViewMarks.jsx
import React, { useState } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { FileText, TrendingUp, Award, AlertCircle, Search } from 'lucide-react';

const ViewMarks = () => {
  const { user } = useAuth();
  const { marks, students, subjects, exams } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterExam, setFilterExam] = useState('');

  // Only teacher's marks
  const teacherMarks = marks?.filter(mark => (mark.teacher?._id || mark.teacher) === (user.id || user._id)) || [];

  const filteredMarks = teacherMarks.filter(mark => {
    // mark.student, mark.subject, mark.exam are populated objects
    const studentName = mark.student?.fullName || '';
    const subjectId = mark.subject?._id || mark.subject;
    const examId = mark.exam?._id || mark.exam;

    const matchesSearch = !searchTerm || studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || subjectId === filterSubject;
    const matchesExam = !filterExam || examId === filterExam;
    return matchesSearch && matchesSubject && matchesExam;
  });

  // Stats
  const totalMarks = filteredMarks.length;
  const averageMarks = totalMarks > 0 ? Math.round(filteredMarks.reduce((sum, m) => sum + m.marks, 0) / totalMarks) : 0;
  const highestMark = totalMarks > 0 ? Math.max(...filteredMarks.map(m => m.marks)) : 0;
  const lowestMark = totalMarks > 0 ? Math.min(...filteredMarks.map(m => m.marks)) : 0;

  // Grade helper
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
        <h2 className="text-3xl font-bold text-gray-900">View Marks</h2>
        <p className="text-gray-600">Review marks you have entered</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="Total Entries" value={totalMarks} icon={<FileText className="h-6 w-6 text-blue-600" />} bg="bg-blue-100" />
        <StatCard label="Average Score" value={`${averageMarks}%`} icon={<TrendingUp className="h-6 w-6 text-green-600" />} bg="bg-green-100" />
        <StatCard label="Highest Score" value={`${highestMark}%`} icon={<Award className="h-6 w-6 text-yellow-600" />} bg="bg-yellow-100" />
        <StatCard label="Lowest Score" value={`${lowestMark}%`} icon={<AlertCircle className="h-6 w-6 text-red-600" />} bg="bg-red-100" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputWithIcon
            label="Search Student"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search student..."
            icon={<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />}
          />
          <SelectFilter
            label="Filter by Subject"
            value={filterSubject}
            onChange={setFilterSubject}
            options={subjects}
            optLabel="name"
            optValue="_id"
            allText="All Subjects"
          />
          <SelectFilter
            label="Filter by Exam"
            value={filterExam}
            onChange={setFilterExam}
            options={exams}
            optLabel="name"
            optValue="_id"
            allText="All Exams"
          />
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Student</Th>
              <Th>Subject</Th>
              <Th>Exam</Th>
              <Th>Marks</Th>
              <Th>Grade</Th>
              <Th>Entry Date</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMarks.map((mark) => {
              const student = mark.student;
              const subject = mark.subject;
              const exam = mark.exam;
              return (
                <tr key={mark._id || mark.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-medium text-sm">{student?.fullName?.charAt(0) || '?'}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student?.fullName || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{student?.class?.name || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subject?.name || '-'}</div>
                    <div className="text-sm text-gray-500">{subject?.code || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{exam?.name || '-'}</div>
                    <div className="text-sm text-gray-500">{exam?.type || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-2xl font-bold ${mark.marks >= 80 ? 'text-green-600' :
                      mark.marks >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {mark.marks}
                    </span>
                    <span className="text-gray-500 ml-1">/ 100</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${mark.marks >= 80 ? 'bg-green-100 text-green-800' :
                      mark.marks >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {getGrade(mark.marks)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mark.entryDate ? new Date(mark.entryDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              );
            })}
            {filteredMarks.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  <AlertCircle className="inline-block mr-2" />
                  No marks found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reusable components:
function StatCard({ label, value, icon, bg }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bg}`}>{icon}</div>
      </div>
    </div>
  );
}
function InputWithIcon({ label, value, onChange, placeholder, icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {icon}
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
function SelectFilter({ label, value, onChange, options, optLabel, optValue, allText }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      >
        <option value="">{allText}</option>
        {options.map(opt => (
          <option key={opt[optValue]} value={opt[optValue]}>{opt[optLabel]}</option>
        ))}
      </select>
    </div>
  );
}
function Th({ children }) {
  return <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{children}</th>;
}

export default ViewMarks;
