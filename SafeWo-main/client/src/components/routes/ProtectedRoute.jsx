import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
