import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          Hexlet Chat
        </Link>
        {user && (
          <div className="header-user">
            <span className="username">{user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
