// src/components/pages/admin/CorrectionRequests.jsx

import React from 'react';
import { useData } from "../Context/DataContext";
import { FileText, Check, XCircle, AlertCircle } from 'lucide-react';

const CorrectionRequests = () => {
  const {
    correctionRequests,
    setCorrectionRequests,
    students,
    subjects,
    exams,
    marks,
    setMarks,
    users,
    updateCorrectionRequest,
    updateMark
  } = useData();

  // Fallback loading for missing context (prevents white screen)
  if (
    !correctionRequests || !students || !subjects ||
    !exams || !marks || !users
  ) {
    return (
      <div className="p-10 text-gray-600 text-lg flex justify-center items-center min-h-screen">
        Loading data...
      </div>
    );
  }

  const pendingRequests = correctionRequests.filter(req => req.status === 'teacher_approved' || req.status === 'pending');

  const handleApprove = async (requestId) => {
    const request = correctionRequests.find(req => (req._id === requestId || req.id === requestId));
    if (!request) return;

    try {
      // Use the linked markId from the request
      const markId = request.mark?._id || request.mark;
      const markToUpdate = marks.find(m => (m._id === markId || m.id === markId));

      if (markToUpdate) {
        // Prepare the updated mark data
        const updatedMarkPayload = {
          ...markToUpdate,
          marks: request.proposedMarks,
          // Ensure we send IDs for refs if the backend expects them, or just the whole object if it handles it
          student: markToUpdate.student?._id || markToUpdate.student,
          subject: markToUpdate.subject?._id || markToUpdate.subject,
          exam: markToUpdate.exam?._id || markToUpdate.exam,
          teacher: markToUpdate.teacher?._id || markToUpdate.teacher
        };

        await updateMark(markToUpdate._id || markToUpdate.id, updatedMarkPayload);
      } else {
        // Create a NEW mark if it didn't exist
        const newMarkPayload = {
          student: request.student?._id || request.student,
          subject: request.subject?._id || request.subject,
          exam: request.exam?._id || request.exam,
          teacher: request.teacher?._id || request.teacher,
          marks: request.proposedMarks
        };
        await addMark(newMarkPayload);
      }

      // Update request status
      await updateCorrectionRequest(requestId, {
        status: 'approved',
        adminReviewDate: new Date(),
        adminComment: 'Approved by administrator'
      });

    } catch (error) {
      console.error("Failed to approve request", error);
      alert("Failed to approve request");
    }
  };

  const handleReject = async (requestId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await updateCorrectionRequest(requestId, {
        status: 'rejected',
        adminReviewDate: new Date(),
        adminComment: reason
      });
    } catch (error) {
      console.error("Failed to reject request", error);
      alert("Failed to reject request");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Correction Requests</h2>
        <p className="text-gray-600">Review and approve mark correction requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Requests"
          value={correctionRequests.length}
          icon={<FileText className="h-6 w-6 text-blue-600" />}
          bg="bg-blue-100"
        />
        <StatCard
          label="Pending Review"
          value={pendingRequests.length}
          valueClass="text-orange-600"
          icon={<AlertCircle className="h-6 w-6 text-orange-600" />}
          bg="bg-orange-100"
        />
        <StatCard
          label="Approved"
          value={correctionRequests.filter(r => r.status === 'approved').length}
          valueClass="text-green-600"
          icon={<Check className="h-6 w-6 text-green-600" />}
          bg="bg-green-100"
        />
        <StatCard
          label="Rejected"
          value={correctionRequests.filter(r => r.status === 'rejected').length}
          valueClass="text-red-600"
          icon={<XCircle className="h-6 w-6 text-red-600" />}
          bg="bg-red-100"
        />
      </div>

      {/* Requests Table */}
      <RequestsTable
        pendingRequests={pendingRequests}
        students={students}
        subjects={subjects}
        exams={exams}
        users={users}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />

      {/* All Requests History */}
      <HistoryTable
        correctionRequests={correctionRequests}
        students={students}
        subjects={subjects}
      />
    </div>
  );
};

function StatCard({ label, value, icon, bg, valueClass = "" }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bg}`}>{icon}</div>
      </div>
    </div>
  );
}

function RequestsTable({
  pendingRequests,
  students,
  subjects,
  exams,
  users,
  handleApprove,
  handleReject
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Pending Requests ({pendingRequests.length})
        </h3>
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
                Requester
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Request Date
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
                      <div className="text-sm text-gray-500">{subject?.name || 'Unknown'} ({subject?.code || 'N/A'})</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{exam?.name}</div>
                    <div className="text-sm text-gray-500">{exam?.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-red-600 font-semibold">{request.originalMarks}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-green-600 font-semibold">{request.proposedMarks}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">{request.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 truncate max-w-[120px]">{student?.fullName}</div>
                    <div className="text-sm text-gray-500">Student</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(requestId)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors shrink-0"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(requestId)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors shrink-0"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pendingRequests.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No pending correction requests at the moment.</p>
        </div>
      )}
    </div>
  );
}

function HistoryTable({ correctionRequests, students, subjects }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">All Requests History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Student & Subject
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Review Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {correctionRequests.map((request) => {
              const student = request.mark?.student || request.student;
              const subject = request.mark?.subject || request.subject;
              const requestId = request._id || request.id;

              return (
                <tr key={requestId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">{student?.fullName || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{subject?.name || 'Unknown'}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.adminReviewDate ? new Date(request.adminReviewDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CorrectionRequests;
