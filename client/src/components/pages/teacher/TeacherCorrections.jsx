// src/components/Teacher/TeacherCorrections.jsx
import React from 'react';
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";

import { FileText, Check, XCircle, Clock, AlertCircle } from 'lucide-react';

// Teacher Corrections Component - Only Accept/Reject Student Requests
const TeacherCorrections = () => {
  const { user } = useAuth();
  const { correctionRequests, updateCorrectionRequest } = useData();

  // Filter requests from students for marks entered by this teacher OR targeted at this teacher
  const receivedRequests = correctionRequests.filter(req => {
    // Check if the mark was entered by this teacher
    const markTeacherId = req.mark?.teacher?._id || req.mark?.teacher;
    // OR check if the request was directly sent to this teacher
    const directTeacherId = req.teacher?._id || req.teacher;

    const currentTeacherId = user.id || user._id;
    const isThisTeacher = markTeacherId === currentTeacherId || directTeacherId === currentTeacherId;

    // Only show pending requests in this view (or customize as needed)
    return isThisTeacher && req.status !== 'approved' && req.status !== 'rejected';
  });

  // Handle accepting student requests (forward to admin)
  const handleAcceptRequest = async (requestId) => {
    const payload = {
      status: 'teacher_approved',
      teacherReviewDate: new Date()
    };
    const res = await updateCorrectionRequest(requestId, payload);
    if (!res.success) alert(res.message);
  };

  // Handle rejecting student requests
  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    const payload = {
      status: 'rejected',
      teacherReviewDate: new Date(),
      teacherComment: reason
    };
    const res = await updateCorrectionRequest(requestId, payload);
    if (!res.success) alert(res.message);
  };

  const pendingRequests = receivedRequests.filter(req => req.status === 'pending');
  const reviewedRequests = receivedRequests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Correction Requests</h2>
        <p className="text-gray-600">Review correction requests from students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{receivedRequests.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-orange-600">{pendingRequests.length}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviewed</p>
              <p className="text-3xl font-bold text-green-600">{reviewedRequests.length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Pending Requests ({pendingRequests.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve correction requests from students for marks you have entered.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Student & Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Marks Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingRequests.map((request) => {
                const student = request.mark?.student || request.student;
                const subject = request.mark?.subject || request.subject;
                const exam = request.mark?.exam || request.exam;
                const requestId = request._id || request.id;

                return (
                  <tr key={requestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">{student?.fullName || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{subject?.name} ({subject?.code})</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exam?.name}</div>
                      <div className="text-sm text-gray-500">{exam?.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-red-600 font-semibold">{request.originalMarks ?? 0}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-green-600 font-semibold">{request.proposedMarks}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptRequest(requestId)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center transition-colors shrink-0"
                          title="Accept and forward to admin"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(requestId)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center transition-colors shrink-0"
                          title="Reject request"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {pendingRequests.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No pending correction requests from students.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviewed Requests History */}
      {reviewedRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Reviewed Requests ({reviewedRequests.length})
            </h3>
          </div>

          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student & Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Your Decision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviewedRequests.map((request) => {
                  const student = request.mark?.student || request.student;
                  const subject = request.mark?.subject || request.subject;
                  const requestId = request._id || request.id;

                  return (
                    <tr key={requestId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student?.fullName || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{subject?.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-red-600 font-semibold">{request.originalMarks ?? 0}</span>
                          <span className="mx-2 text-gray-400">→</span>
                          <span className="text-green-600 font-semibold">{request.proposedMarks}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'teacher_approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                          }`}>
                          {request.status === 'teacher_approved' ? 'Approved' : 'Rejected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'teacher_approved' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {request.status === 'teacher_approved' ? 'Pending Admin' :
                            request.status === 'approved' ? 'Final Approved' : 'Final Rejected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.teacherReviewDate && new Date(request.teacherReviewDate).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCorrections;