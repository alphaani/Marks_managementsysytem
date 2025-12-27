import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { Plus, FileText, Calendar, Award } from "lucide-react";

const StudentCorrections = () => {
  const { user } = useAuth();
  const { students, subjects, exams, marks, correctionRequests, addCorrectionRequest, employees } = useData();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    examId: '',
    proposedMarks: '',
    reason: ''
  });

  // Find current student
  const currentStudent = students?.find(s => (s.user?._id || s.user?.id || s.user) === (user.id || user._id));

  // Filter correct marks
  const studentMarks = marks.filter(mark => {
    const markStudentId = mark.student?._id || mark.student;
    const currentStudentId = currentStudent?._id || currentStudent?.id;
    return markStudentId === currentStudentId;
  });

  // Filter correct requests
  const studentRequests = correctionRequests.filter(req => {
    const markStudentId = req.mark?.student?._id || req.mark?.student;
    const currentStudentId = currentStudent?._id || currentStudent?.id;
    return markStudentId === currentStudentId;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find the original mark based on selection (if any)
    const originalMark = studentMarks.find(mark => {
      const markSubjectId = mark.subject?._id || mark.subject;
      const markExamId = mark.exam?._id || mark.exam;
      return markSubjectId === formData.subjectId && markExamId === formData.examId;
    });

    // Find the teacher assigned to this class and subject
    const targetTeacherEmployee = employees?.find(emp =>
      emp.assignedClasses?.some(ac => {
        const classId = ac.class?._id || ac.class;
        const subjectId = ac.subject?._id || ac.subject;
        const studentClassId = currentStudent.class?._id || currentStudent.class;
        return classId === studentClassId && subjectId === formData.subjectId;
      })
    );

    const teacherUserId = targetTeacherEmployee?.user?._id || targetTeacherEmployee?.user;

    if (!teacherUserId) {
      alert('No teacher is assigned to this subject for your class. Please contact admin.');
      return;
    }

    const payload = {
      mark: originalMark?._id || originalMark?.id || null,
      student: currentStudent._id || currentStudent.id,
      subject: formData.subjectId,
      exam: formData.examId,
      teacher: teacherUserId,
      originalMarks: originalMark ? originalMark.marks : 0,
      proposedMarks: parseInt(formData.proposedMarks),
      reason: formData.reason,
      status: 'pending'
    };

    const res = await addCorrectionRequest(payload);
    if (res.success) {
      setShowModal(false);
      resetForm();
    } else {
      alert(res.message);
    }
  };

  const resetForm = () => {
    setFormData({
      subjectId: '',
      examId: '',
      proposedMarks: '',
      reason: ''
    });
  };

  if (!currentStudent) {
    return <div className="p-6 text-center text-gray-500">Student profile not found. Please contact administration.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Correction Requests</h2>
          <p className="text-gray-600">Submit requests for mark corrections</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{studentRequests.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600">
                {studentRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {studentRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
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
                Marks Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Request Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentRequests.map((request) => {
              // Priority: request.mark fields, then direct request fields
              const subject = request.mark?.subject || request.subject;
              const exam = request.mark?.exam || request.exam;

              return (
                <tr key={request._id || request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{subject?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{subject?.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{exam?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{exam?.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-red-600 font-semibold">{request.originalMarks ?? 0}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-green-600 font-semibold">{request.proposedMarks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'teacher_approved' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {request.status === 'teacher_approved' ? 'Teacher Approved' : request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submit Correction Request
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id || subject.id} value={subject._id || subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam
                </label>
                <select
                  value={formData.examId}
                  onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Exam</option>
                  {exams.map(exam => (
                    <option key={exam._id || exam.id} value={exam._id || exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposed Marks
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.proposedMarks}
                  onChange={(e) => setFormData({ ...formData, proposedMarks: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Correction
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCorrections;
