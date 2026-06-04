import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout & Protection
import Layout from './layouts/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import StudentCompanies from './pages/Student/Companies';
import StudentApplications from './pages/Student/Applications';
import StudentProfile from './pages/Student/Profile';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminCompanies from './pages/Admin/Companies';
import AdminApplicants from './pages/Admin/Applicants';
import AdminAnalytics from './pages/Admin/Analytics';

import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';

// Root redirect logic based on role
const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  
  return <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Protected Routes (Student & Admin wrapper) */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/companies" element={<StudentCompanies />} />
          <Route path="/student/applications" element={<StudentApplications />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute><Layout /></AdminRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/company/:companyId/applicants" element={<AdminApplicants />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
