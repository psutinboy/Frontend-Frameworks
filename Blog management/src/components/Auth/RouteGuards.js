import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Private Route Guard - Requires authentication
export const PrivateRoute = ({
  children,
  requiredRole = null,
  requiredRoles = [],
}) => {
  const { isAuthenticated, isLoading, hasRole, hasAnyRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Guard - Redirects authenticated users away from login
export const PublicRoute = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Admin Only Route Guard
export const AdminRoute = ({ children }) => {
  return <PrivateRoute requiredRole="admin">{children}</PrivateRoute>;
};

// Route Guard for multiple roles
export const RoleBasedRoute = ({ children, allowedRoles }) => {
  return <PrivateRoute requiredRoles={allowedRoles}>{children}</PrivateRoute>;
};
