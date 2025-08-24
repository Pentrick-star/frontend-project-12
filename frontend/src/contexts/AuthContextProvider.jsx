import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      console.log('Validating token with /auth/me');
      // Получаем данные пользователя с сервера
      api.get('/auth/me')
        .then(response => {
          console.log('Token validation successful:', response.data);
          // Проверяем, что ответ не является HTML
          if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
            console.log('Token validation returned HTML instead of JSON, treating as invalid');
            throw new Error('Invalid response format');
          }
          setUserState(response.data);
        })
        .catch((error) => {
          console.log('Token validation failed:', error.response?.status);
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
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
    // Устанавливаем временного пользователя на основе токена
    // Позже /auth/me обновит данные
    setUserState({ username: 'User' });
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
