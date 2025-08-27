import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  console.log('PrivateRoute: token =', token, 'loading =', loading);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!token) {
    console.log('PrivateRoute: redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('PrivateRoute: rendering children');
  return children;
};

export default PrivateRoute;
