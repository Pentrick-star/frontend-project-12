import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: token =', token, 'loading =', loading);
    if (token) {
      // Получаем данные пользователя с сервера
      api.get('/auth/me')
        .then(response => {
          console.log('AuthProvider: /auth/me success', response.data);
          setUserState(response.data);
        })
        .catch((error) => {
          console.log('AuthProvider: /auth/me error', error);
          // Если токен недействителен, удаляем его
          localStorage.removeItem('token');
          setTokenState(null);
          setUserState(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken) => {
    console.log('AuthProvider: login called with token', newToken);
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
    // Устанавливаем временного пользователя на основе токена
    // Позже /auth/me обновит данные
    setUserState({ username: 'User' });
    console.log('AuthProvider: login completed, token set to', newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setTokenState(null);
    setUserState(null);
  };

  const value = {
    token,
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
