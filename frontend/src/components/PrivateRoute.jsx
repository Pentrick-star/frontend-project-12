import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  console.log('PrivateRoute: token =', token);

  if (!token) {
    console.log('PrivateRoute: redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('PrivateRoute: rendering children');
  return children;
};

export default PrivateRoute;
