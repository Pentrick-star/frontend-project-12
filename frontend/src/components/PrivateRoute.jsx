import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  console.log('PrivateRoute - token:', token, 'loading:', loading);

  if (loading) {
    console.log('PrivateRoute - showing loading');
    return <div>Загрузка...</div>;
  }

  if (!token) {
    console.log('PrivateRoute - no token, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('PrivateRoute - token exists, showing children');
  return children;
};

export default PrivateRoute;
