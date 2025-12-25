import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { Search } from "lucide-react";

const StudentMarks = () => {
  const { user } = useAuth();
  const { students, marks, subjects, exams } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterExam, setFilterExam] = useState('');

  // Find current student
  // Find current student
  // s.user is populated, so we compare s.user._id with user.id (from AuthContext)
  const currentStudent = students.find(s => (s.user?._id || s.user?.id) === (user.id || user._id));

  // Marks are populated with student, subject, and exam objects
  const studentMarks = marks.filter(mark => {
    const markStudentId = mark.student?._id || mark.student;
    const currentStudentId = currentStudent?._id || currentStudent?.id;
    return markStudentId === currentStudentId;
  });

  const filteredMarks = studentMarks.filter(mark => {
    // mark.subject and mark.exam are already populated objects
    const subjectName = mark.subject?.name || '';
    const examName = mark.exam?.name || '';

    const matchesSearch = !searchTerm ||
      subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examName.toLowerCase().includes(searchTerm.toLowerCase());

    const subjectId = mark.subject?._id || mark.subject;
    const examId = mark.exam?._id || mark.exam;

    const matchesSubject = !filterSubject || subjectId === filterSubject;
    const matchesExam = !filterExam || examId === filterExam;

    return matchesSearch && matchesSubject && matchesExam;
  });

  if (!currentStudent) {
    return <div className="p-6 text-center text-gray-500">Student profile not found. Please contact administration.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">My Marks</h2>
        <p className="text-gray-600">View all your exam results and performance</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Subject/Exam
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Subject
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id || subject.id} value={subject._id || subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Exam
            </label>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Exams</option>
              {exams.map(exam => (
                <option key={exam._id || exam.id} value={exam._id || exam.id}>{exam.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Exam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Marks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMarks.map((mark) => {
              // mark.subject and mark.exam are populated objects
              const grade = mark.marks >= 90 ? 'A+' : mark.marks >= 80 ? 'A' : mark.marks >= 70 ? 'B' : mark.marks >= 60 ? 'C' : mark.marks >= 50 ? 'D' : 'F';

              return (
                <tr key={mark._id || mark.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{mark.subject?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{mark.subject?.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mark.exam?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{mark.exam?.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-2xl font-bold ${mark.marks >= 80 ? 'text-green-600' :
                      mark.marks >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                      {mark.marks}
                    </span>
                    <span className="text-gray-500 ml-1">/ 100</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${mark.marks >= 80 ? 'bg-green-100 text-green-800' :
                      mark.marks >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(mark.entryDate).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default StudentMarks;
