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
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#f5f7fa', borderBottom: '1px solid #dee2e6' }}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand" style={{ color: '#333333' }}>
          {t('header.logo')}
        </Link>
        {user && (
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3" style={{ color: '#6c757d' }}>{user.username}</span>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-primary"
              style={{ 
                color: '#007bff', 
                borderColor: '#007bff',
                backgroundColor: 'transparent'
              }}
            >
              {t('common.logout')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
