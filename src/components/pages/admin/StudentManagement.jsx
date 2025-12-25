// src/components/Admin/StudentManagement.jsx
import React, { useState } from 'react';
import { useData } from "../Context/DataContext";
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const StudentManagement = () => {
  const { students, users, classes, addStudent, updateStudent, deleteStudent } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    user: '',
    fullName: '',
    age: '',
    gender: '',
    class: '',
    academicYear: '',
    dateOfBirth: ''
  });

  const availableUsers = users.filter(user =>
    user.role === 'student' &&
    !students.some(student => {
      const sUserId = student.user?._id || student.user;
      const uId = user._id || user.id;
      return sUserId === uId;
    })
  );

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      user: formData.user,
      userId: undefined
    };

    if (editingStudent) {
      const id = editingStudent._id || editingStudent.id;
      const res = await updateStudent(id, payload);
      if (!res.success) alert(res.message);
    } else {
      const res = await addStudent(payload);
      if (!res.success) alert(res.message);
    }
    setShowModal(false);
    setEditingStudent(null);
    resetForm();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      user: student.user?._id || student.user || '',
      fullName: student.fullName,
      age: student.age,
      gender: student.gender,
      class: student.class?._id || student.class || '', // Handle populated vs raw ID
      academicYear: student.academicYear,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  // ... check handleDelete in file ...

  // ... check resetForm in file ...

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Student Management</h2>
          <p className="text-gray-600">Manage student profiles and academic information</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingStudent(null);
            resetForm();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search students..."
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student._id || student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-medium">
                        {student.fullName.charAt(0)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.class?.name || classes.find(c => (c._id || c.id) === student.class)?.name || 'Not Enrolled'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.academicYear}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(student._id || student.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Account
                </label>
                <select
                  value={formData.user}
                  onChange={(e) => {
                    const selectedUser = users.find(u => (u._id || u.id) == e.target.value);
                    setFormData({
                      ...formData,
                      user: e.target.value,
                      fullName: selectedUser ? selectedUser.fullName : ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!!editingStudent}
                >
                  <option value="">Select User</option>
                  {availableUsers.map(user => (
                    <option key={user._id || user.id} value={user._id || user.id}>{user.fullName}</option>
                  ))}
                  {editingStudent && (
                    <option value={typeof editingStudent.user === 'object' ? editingStudent.user._id : editingStudent.user}>
                      {typeof editingStudent.user === 'object' ? editingStudent.user.fullName : 'Current User'}
                    </option>
                  )}
                </select>
              </div>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id || cls.id} value={cls._id || cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingStudent ? 'Update' : 'Create'} Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
