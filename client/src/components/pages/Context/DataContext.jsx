import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [marks, setMarks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [correctionRequests, setCorrectionRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        usersRes,
        classesRes,
        studentsRes,
        employeesRes,
        subjectsRes,
        examsRes,
        marksRes,
        correctionsRes
      ] = await Promise.all([
        axios.get("/api/users"),
        axios.get("/api/classes"),
        axios.get("/api/students"),
        axios.get("/api/employees"),
        axios.get("/api/subjects"),
        axios.get("/api/exams"),
        axios.get("/api/marks"),
        axios.get("/api/correction-requests")
      ]);

      setUsers(usersRes.data);
      setClasses(classesRes.data);
      setStudents(studentsRes.data);
      setEmployees(employeesRes.data);
      setSubjects(subjectsRes.data);
      setExams(examsRes.data);
      setMarks(marksRes.data);
      setCorrectionRequests(correctionsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to update state and backend (Optimistic UI or simple await)
  // For simplicity, we just expose the fetch function or we can implement specific adders
  // But given standard Context usage, often people want 'setX' to just work.
  // However, replacing local storage setters with API calls is complex if components assume sync.
  // We'll expose fetchData to refresh, and maybe simple CRUD wrappers if needed.
  // For now, let's keep the API consistent with the previous 'value' object but log warnings or implement basic creates.
  // Previous: setUsers: (d) => saveToStorage("users", d) -> This replaced the ENTIRE array.
  // This pattern is bad for API.
  // We should ideally refactor the consuming components. 
  // But to minimize friction, I will keep the state setters (setUsers) as local state setters, 
  // AND add explicit API methods that components *should* use. 
  // If components use setUsers directly to "save", it won't persist to DB.
  // I'll add a 'refreshData' method.

  // CRUD Operations for Users
  const addUser = async (userData) => {
    try {
      const res = await axios.post("/api/users", userData);
      setUsers([...users, res.data]);
      return { success: true };
    } catch (error) {
      console.error("Error adding user:", error);
      return { success: false, message: error.response?.data?.message || 'Failed to add user' };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const res = await axios.put(`/api/users/${id}`, userData);
      setUsers(users.map(u => (u._id === id || u.id === id) ? res.data : u));
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, message: error.response?.data?.message || 'Failed to update user' };
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter(u => u._id !== id && u.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete user' };
    }
  };

  // CRUD for Students
  const addStudent = async (studentData) => {
    try {
      const res = await axios.post("/api/students", studentData);
      setStudents([...students, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add student' };
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const res = await axios.put(`/api/students/${id}`, studentData);
      setStudents(students.map(s => (s._id === id || s.id === id) ? res.data : s));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update student' };
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`/api/students/${id}`);
      setStudents(students.filter(s => s._id !== id && s.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete student' };
    }
  };

  // CRUD for Employees
  const addEmployee = async (employeeData) => {
    try {
      const res = await axios.post("/api/employees", employeeData);
      setEmployees([...employees, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add employee' };
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      const res = await axios.put(`/api/employees/${id}`, employeeData);
      setEmployees(employees.map(e => (e._id === id || e.id === id) ? res.data : e));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update employee' };
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      setEmployees(employees.filter(e => e._id !== id && e.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete employee' };
    }
  };

  // CRUD for Subjects
  const addSubject = async (subjectData) => {
    try {
      const res = await axios.post("/api/subjects", subjectData);
      setSubjects([...subjects, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add subject' };
    }
  };

  const updateSubject = async (id, subjectData) => {
    try {
      const res = await axios.put(`/api/subjects/${id}`, subjectData);
      setSubjects(subjects.map(s => (s._id === id || s.id === id) ? res.data : s));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update subject' };
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`/api/subjects/${id}`);
      setSubjects(subjects.filter(s => s._id !== id && s.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete subject' };
    }
  };

  // CRUD for Exams
  const addExam = async (examData) => {
    try {
      const res = await axios.post("/api/exams", examData);
      setExams([...exams, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add exam' };
    }
  };

  const updateExam = async (id, examData) => {
    try {
      const res = await axios.put(`/api/exams/${id}`, examData);
      setExams(exams.map(e => (e._id === id || e.id === id) ? res.data : e));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update exam' };
    }
  };

  const deleteExam = async (id) => {
    try {
      await axios.delete(`/api/exams/${id}`);
      setExams(exams.filter(e => e._id !== id && e.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete exam' };
    }
  };

  // CRUD for Marks
  const addMark = async (markData) => {
    try {
      const res = await axios.post("/api/marks", markData);
      setMarks([...marks, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add mark' };
    }
  };

  const updateMark = async (id, markData) => {
    try {
      const res = await axios.put(`/api/marks/${id}`, markData);
      setMarks(marks.map(m => (m._id === id || m.id === id) ? res.data : m));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update mark' };
    }
  };

  const deleteMark = async (id) => {
    try {
      await axios.delete(`/api/marks/${id}`);
      setMarks(marks.filter(m => m._id !== id && m.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete mark' };
    }
  };

  // CRUD for Correction Requests
  const addCorrectionRequest = async (requestData) => {
    try {
      const res = await axios.post("/api/correction-requests", requestData);
      setCorrectionRequests([...correctionRequests, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add correction request' };
    }
  };

  const updateCorrectionRequest = async (id, requestData) => {
    try {
      const res = await axios.put(`/api/correction-requests/${id}`, requestData);
      setCorrectionRequests(correctionRequests.map(r => (r._id === id || r.id === id) ? res.data : r));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update correction request' };
    }
  };

  // CRUD for Classes
  const addClass = async (classData) => {
    try {
      const res = await axios.post("/api/classes", classData);
      setClasses([...classes, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add class' };
    }
  };

  const updateClass = async (id, classData) => {
    try {
      const res = await axios.put(`/api/classes/${id}`, classData);
      setClasses(classes.map(c => (c._id === id || c.id === id) ? res.data : c));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update class' };
    }
  };

  const deleteClass = async (id) => {
    try {
      await axios.delete(`/api/classes/${id}`);
      setClasses(classes.filter(c => c._id !== id && c.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete class' };
    }
  };

  const value = {
    users, setUsers,
    students, setStudents,
    employees, setEmployees,
    subjects, setSubjects,
    exams, setExams,
    marks, setMarks,
    correctionRequests, setCorrectionRequests,
    loadData: fetchData,
    loading,
    addUser,
    updateUser,
    deleteUser,
    addStudent,
    updateStudent,
    deleteStudent,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addSubject, updateSubject, deleteSubject,
    addExam, updateExam, deleteExam,
    addMark, updateMark, deleteMark,
    addCorrectionRequest, updateCorrectionRequest,
    classes, addClass, updateClass, deleteClass
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
