import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Register from '../pages/public/Register';
import OTPVerification from '../pages/public/OTPVerification';
import Login from '../pages/public/Login';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';

const PublicRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users to their dashboard
  const getDashboardPath = () => {
    if (!isAuthenticated) return null;
    switch (user?.role) {
      case 'customer':
        return '/customer/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'admin':
      case 'staff':
        return '/admin/dashboard';
      default:
        return null;
    }
  };

  const dashboardPath = getDashboardPath();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to={dashboardPath} /> : <Navigate to="/login" />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to={dashboardPath} /> : <Register />}
      />
      <Route
        path="/otp-verification"
        element={<OTPVerification />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={dashboardPath} /> : <Login />}
      />
      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to={dashboardPath} /> : <ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={isAuthenticated ? <Navigate to={dashboardPath} /> : <ResetPassword />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default PublicRoutes;

