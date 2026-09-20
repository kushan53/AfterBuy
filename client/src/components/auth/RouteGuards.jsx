import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * GuestRoute: Redirects logged-in users to /app/dashboard
 * Used for: LoginPage (/login), SignupPage (/signup)
 */
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F1115]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

/**
 * ProtectedRoute: Redirects unauthenticated users to /login
 * Used for: /app/* dashboard and private pages
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isLoggingOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F1115]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  // If user explicitly logged out, take them directly to Homepage (/)
  if (isLoggingOut) {
    return <Navigate to="/" replace />;
  }

  // If unauthenticated visitor attempted direct access, take them to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};
