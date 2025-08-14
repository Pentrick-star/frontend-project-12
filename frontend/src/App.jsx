import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ChatPage from './components/ChatPage';
import NotFoundPage from './components/NotFoundPage';
import Header from './components/Header';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем токен при загрузке приложения
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <ChatPage />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <SignupPage onLogin={handleLogin} />
              )
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
