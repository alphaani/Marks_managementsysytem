// src/components/Teacher/MarksEntry.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
// import { useEffect } from 'react';
import { FileText, Save, Check, AlertCircle, Clock } from 'lucide-react';

const MarksEntry = () => {
  const { user } = useAuth();
  const { students, subjects, exams, marks, employees, addMark, updateMark, loadData } = useData();

  // UI State
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [marksData, setMarksData] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Prevent render if missing data
  if (!user || !students || !subjects || !exams) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  // Find Current Teacher
  const currentTeacher = employees.find(e => {
    const uId = e.user?._id || e.user;
    const loggedInId = user._id || user.id;
    return uId === loggedInId;
  });

  // Get Assigned Classes (Unique)
  const availableClasses = currentTeacher?.assignedClasses?.reduce((acc, curr) => {
    const cls = curr.class;
    if (!cls) return acc; // Robustness: skip if class is deleted/null
    const clsId = cls?._id || cls;
    if (!acc.some(c => (c._id || c.id || c) === clsId)) {
      acc.push(cls);
    }
    return acc;
  }, []) || [];

  // Get Subjects for Selected Class
  const availableSubjects = currentTeacher?.assignedClasses
    ?.filter(ac => {
      if (!ac.class || !ac.subject) return false;
      const cId = ac.class?._id || ac.class;
      return String(cId) === String(selectedClass);
    })
    .map(ac => ac.subject) || [];

  // Filter Students by Selected Class
  const filteredStudents = students.filter(student => {
    const sClassId = student.class?._id || student.class;
    return sClassId === selectedClass;
  });

  // Get only active/open exams
  const openExams = exams?.filter(exam => exam.status === 'open') || [];

  // Update marksData on input
  const handleMarksChange = (studentId, value) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    setMarksData(prev => ({
      ...prev,
      [studentId]: numValue
    }));
  };

  // Save marks to context/state
  const handleSaveMarks = async () => {
    if (!selectedClass || !selectedSubject || !selectedExam) {
      setMessage('Please select class, subject and exam');
      return;
    }
    if (Object.keys(marksData).length === 0) {
      setMessage('Please enter marks for at least one student');
      return;
    }
    setSaving(true);
    try {
      const promises = Object.entries(marksData).map(async ([studentId, markValue]) => {
        const payload = {
          student: studentId,
          subject: selectedSubject,
          exam: selectedExam,
          marks: markValue,
          teacher: user.id || user._id,
          entryDate: new Date()
        };

        // Check for existing mark to update logic if generic "addMark" doesn't handle upsert
        // Improved: The backend likely handles upsert or we check FE.
        // Let's use existing logic: find match in 'marks' array
        const existingMark = marks.find(m =>
          (m.student?._id === studentId || m.student === studentId) &&
          (m.subject?._id === selectedSubject || m.subject === selectedSubject) &&
          (m.exam?._id === selectedExam || m.exam === selectedExam)
        );

        if (existingMark) {
          return updateMark(existingMark._id || existingMark.id, payload);
        } else {
          return addMark(payload);
        }
      });

      await Promise.all(promises);
      await loadData();

      setMessage('Marks saved successfully!');
      setTimeout(() => setMessage(''), 2500);
      setMarksData({}); // Optional: clear local state or keep it? Better to refetch.
    } catch (e) {
      console.error(e);
      setMessage('Error saving marks');
    } finally {
      setSaving(false);
    }
  };

  // Pre-fill marks
  useEffect(() => {
    if (!selectedClass || !selectedSubject || !selectedExam) {
      setMarksData({});
      return;
    }
    const existingMarks = {};
    marks.forEach(mark => {
      const sId = mark.subject?._id || mark.subject;
      const eId = mark.exam?._id || mark.exam;
      const stuId = mark.student?._id || mark.student;

      if (sId === selectedSubject && eId === selectedExam) {
        existingMarks[stuId] = mark.marks;
      }
    });
    setMarksData(existingMarks);
  }, [selectedClass, selectedSubject, selectedExam, marks]);

  const getGrade = (mark) => {
    if (mark >= 90) return 'A+';
    if (mark >= 80) return 'A';
    if (mark >= 70) return 'B';
    if (mark >= 60) return 'C';
    if (mark >= 50) return 'D';
    if (mark > 0) return 'F';
    return '';
  };

  if (!currentTeacher) {
    return <div className="p-8 text-center text-red-500">Access Denied: You are not registered as a teacher.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Enter Marks</h2>
        <p className="text-gray-600">Input student marks for your assigned classes</p>
      </div>

      {/* Selection Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {availableClasses.length === 0 ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>You have not been assigned to any classes yet. Please contact the administrator.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Select Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={e => {
                  setSelectedClass(e.target.value);
                  setSelectedSubject(''); // Reset subject when class changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Choose Class</option>
                {availableClasses.map(cls => (
                  <option key={cls._id || cls.id} value={cls._id || cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {/* Select Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subject
              </label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                disabled={!selectedClass}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
              >
                <option value="">Choose Subject</option>
                {availableSubjects.map(sub => (
                  <option key={sub._id || sub.id} value={sub._id || sub.id}>{sub.name} ({sub.code})</option>
                ))}
              </select>
            </div>

            {/* Select Exam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Exam
              </label>
              <select
                value={selectedExam}
                onChange={e => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Choose Exam</option>
                {openExams.map(exam => (
                  <option key={exam.id || exam._id} value={exam.id || exam._id}>{exam.name} ({exam.type})</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-lg mb-4 ${message.includes('successfully') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            <div className="flex items-center">
              {message.includes('successfully') ? <Check className="h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
              {message}
            </div>
          </div>
        )}
      </div>

      {/* Marks Entry Table */}
      {selectedClass && selectedSubject && selectedExam && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Student Marks Entry</h3>
              <p className="text-sm text-gray-600">
                Class: {availableClasses.find(c => (c.id || c._id) === selectedClass)?.name} |
                Subject: {subjects.find(s => (s.id || s._id) === selectedSubject)?.name} |
                Exam: {exams.find(e => (e.id || e._id) === selectedExam)?.name}
              </p>
            </div>
            <button
              onClick={handleSaveMarks}
              disabled={saving}
              className={`px-6 py-2 rounded-lg flex items-center transition-all ${saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg active:scale-95'
                } text-white`}
            >
              {saving ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Marks
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Marks (0-100)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-4 text-gray-500">No students found in this class.</td></tr>
                ) : (
                  filteredStudents.map(student => {
                    const studentId = student._id || student.id;
                    const mark = marksData[studentId] || '';
                    const grade = getGrade(mark);
                    return (
                      <tr key={studentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 font-medium text-sm">{student.fullName.charAt(0)}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={mark}
                            onChange={e => handleMarksChange(studentId, e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500"
                            placeholder="0-100"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${mark >= 80 ? 'bg-green-100 text-green-800' :
                            mark >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              mark >= 50 ? 'bg-orange-100 text-orange-800' :
                                mark ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {grade || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {mark
                            ? <span className="flex items-center text-green-600"><Check className="h-4 w-4 mr-1" /><span className="text-xs">Entered</span></span>
                            : <span className="flex items-center text-gray-400"><Clock className="h-4 w-4 mr-1" /><span className="text-xs">Pending</span></span>
                          }
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntry;
