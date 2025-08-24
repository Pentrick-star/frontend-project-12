import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Получаем данные пользователя с сервера
      api.get('/auth/me')
        .then(response => {
          setUserState(response.data);
        })
        .catch(() => {
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
