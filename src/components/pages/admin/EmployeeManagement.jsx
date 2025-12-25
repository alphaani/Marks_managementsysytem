import React, { useState } from "react";
import { useData } from "../Context/DataContext";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const EmployeeManagement = () => {
  const { employees, users, classes, subjects, addEmployee, updateEmployee, deleteEmployee } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    user: "",
    fullName: "",
    employeeType: "",
    salary: "",
    dateOfJoining: "",
    assignedClasses: []
  });

  // State for adding new assignment in modal
  const [newAssignment, setNewAssignment] = useState({ class: "", subject: "" });

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to compare IDs safely (handles string vs object)
  const compareIds = (id1, id2) => {
    if (!id1 || !id2) return false;
    const sId1 = typeof id1 === 'object' ? id1._id || id1.id : id1;
    const sId2 = typeof id2 === 'object' ? id2._id || id2.id : id2;
    return String(sId1) === String(sId2);
  };

  const availableUsers = users.filter(user =>
    (user.role === "admin" || user.role === "teacher") &&
    !employees.some(emp => compareIds(emp.user, user))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Auto-add pending assignment if someone filled the selects but forgot to click "Add"
    let updatedAssignedClasses = [...formData.assignedClasses];
    if (formData.employeeType === 'Teacher' && newAssignment.class && newAssignment.subject) {
      const alreadyExists = updatedAssignedClasses.some(ac =>
        compareIds(ac.class, newAssignment.class) && compareIds(ac.subject, newAssignment.subject)
      );
      if (!alreadyExists) {
        updatedAssignedClasses.push({ ...newAssignment });
      }
    }

    const payload = {
      ...formData,
      assignedClasses: updatedAssignedClasses,
      salary: parseFloat(formData.salary)
    };

    if (editingEmployee) {
      const id = editingEmployee._id || editingEmployee.id;
      const res = await updateEmployee(id, payload);
      if (!res.success) {
        alert(res.message);
        return;
      }
    } else {
      const res = await addEmployee(payload);
      if (!res.success) {
        alert(res.message);
        return;
      }
    }
    setShowModal(false);
    setEditingEmployee(null);
    resetForm();
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      user: employee.user?._id || employee.user || '',
      fullName: employee.fullName,
      employeeType: employee.employeeType,
      salary: employee.salary ? employee.salary.toString() : "0",
      dateOfJoining: employee.dateOfJoining ? new Date(employee.dateOfJoining).toISOString().split('T')[0] : '',
      assignedClasses: (employee.assignedClasses || [])
        .filter(ac => ac.class && ac.subject) // Robustness: filter out deleted refs
        .map(ac => ({
          class: typeof ac.class === 'object' ? ac.class._id : ac.class,
          subject: typeof ac.subject === 'object' ? ac.subject._id : ac.subject
        }))
    });
    setShowModal(true);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(employeeId);
    }
  };

  const resetForm = () => {
    setFormData({
      user: "",
      fullName: "",
      employeeType: "",
      salary: "",
      dateOfJoining: "",
      assignedClasses: []
    });
    setNewAssignment({ class: "", subject: "" });
  };

  const addAssignment = () => {
    if (newAssignment.class && newAssignment.subject) {
      // Prevent duplicates
      if (formData.assignedClasses.some(ac => compareIds(ac.class, newAssignment.class) && compareIds(ac.subject, newAssignment.subject))) {
        alert("Assignment already exists");
        return;
      }
      setFormData({
        ...formData,
        assignedClasses: [...formData.assignedClasses, newAssignment]
      });
      setNewAssignment({ class: "", subject: "" });
    }
  };

  const removeAssignment = (index) => {
    const newAssignments = [...formData.assignedClasses];
    newAssignments.splice(index, 1);
    setFormData({ ...formData, assignedClasses: newAssignments });
  };

  const getClassName = (id) => classes.find(c => compareIds(c, id))?.name || 'Unknown';
  const getSubjectName = (id) => subjects.find(s => compareIds(s, id))?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600">Manage employee profiles and information</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search employees..."
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Assigned Classes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee._id || employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                        <span className="text-purple-600 font-medium uppercase">
                          {employee.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">{employee.fullName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.employeeType === "Admin" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}>
                      {employee.employeeType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${employee.salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.assignedClasses?.filter(ac => ac.class && ac.subject).length > 0 ? (
                      <div className="flex flex-col">
                        {employee.assignedClasses
                          .filter(ac => ac.class && ac.subject)
                          .slice(0, 2)
                          .map((ac, idx) => (
                            <span key={idx} className="text-xs">
                              {(ac.class?.name || getClassName(ac.class))} - {(ac.subject?.name || getSubjectName(ac.subject))}
                            </span>
                          ))}
                        {employee.assignedClasses.filter(ac => ac.class && ac.subject).length > 2 &&
                          <span className="text-xs text-gray-400">+{employee.assignedClasses.filter(ac => ac.class && ac.subject).length - 2} more</span>
                        }
                      </div>
                    ) : <span className="text-xs text-gray-400">None</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id || employee.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Account</label>
                  <select
                    value={formData.user}
                    onChange={(e) => {
                      const selectedUser = users.find(u => (u._id || u.id) == e.target.value);
                      setFormData({
                        ...formData,
                        user: e.target.value,
                        fullName: selectedUser ? selectedUser.fullName : ""
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!!editingEmployee}
                  >
                    <option value="">Select User</option>
                    {availableUsers.map(user => (
                      <option key={user._id || user.id} value={user._id || user.id}>{user.fullName} ({user.role})</option>
                    ))}
                    {editingEmployee && (
                      <option value={typeof editingEmployee.user === 'object' ? editingEmployee.user._id : editingEmployee.user}>
                        {typeof editingEmployee.user === 'object' ? editingEmployee.user.fullName : 'Current User'}
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Type</label>
                  <select
                    value={formData.employeeType}
                    onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Admin">Admin</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Assignments Section */}
              {formData.employeeType === 'Teacher' && (
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Class & Subject Assignments</h4>

                  {/* Add Assignment */}
                  <div className="flex space-x-3 mb-4">
                    <select
                      value={newAssignment.class}
                      onChange={(e) => setNewAssignment({ ...newAssignment, class: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                    </select>
                    <select
                      value={newAssignment.subject}
                      onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name} ({s.code})</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={addAssignment}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>

                  {/* List Assignments */}
                  <div className="bg-gray-50 rounded-md p-3 space-y-2">
                    {formData.assignedClasses.length === 0 && <p className="text-sm text-gray-500 text-center">No assignments yet</p>}
                    {formData.assignedClasses.map((ac, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2 border rounded shadow-sm">
                        <span className="text-sm font-medium">
                          {getClassName(ac.class)} - {getSubjectName(ac.subject)}
                        </span>
                        <button type="button" onClick={() => removeAssignment(idx)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEmployee(null);
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
                  {editingEmployee ? "Update" : "Create"} Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
