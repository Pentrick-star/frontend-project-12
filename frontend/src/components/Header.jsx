import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          {t('header.logo')}
        </Link>
        {user && (
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3">{user.username}</span>
            <button onClick={handleLogout} className="btn btn-outline-light">
              {t('common.logout')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
