import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Здесь можно добавить проверку токена на сервере
      const userData = { username: 'admin' }; // Временно устанавливаем пользователя
      setUserState(userData);
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    console.log('Login with token:', newToken);
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
    const userData = { username: 'admin' }; // Временно устанавливаем пользователя
    setUserState(userData);
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
