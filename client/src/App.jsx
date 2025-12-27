import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/pages/Context/AuthContext";
import { DataProvider } from "./components/pages/Context/DataContext";
import Login from "./components/pages/Login";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import TeacherDashboard from "./components/pages/teacher/TeacherDashboard";
import StudentDashboard from "./components/pages/student/StudentDashboard";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

const AppRouter = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={`/${user.role.toLowerCase()}`} replace /> : <Login />}
      />
      {/* Admin Dashboard */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* --------- TEACHER DASHBOARD ROUTE ---------- */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* {Student Dashboard rout} */}
        <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard/>
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<div>Unauthorized</div>} />
      <Route
        path="*"
        element={
          <Navigate to={user ? `/${user.role.toLowerCase()}` : "/login"} replace />
        }
      />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <DataProvider>
      <Router>
        <AppRouter />
      </Router>
    </DataProvider>
  </AuthProvider>
);

export default App;
