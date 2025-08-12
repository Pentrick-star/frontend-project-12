import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = ({ onLogout, isAuthenticated }) => {
  const { t } = useTranslation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          {t('chat.title')}
        </Navbar.Brand>
        
        <Nav className="ms-auto">
          {isAuthenticated ? (
            <Button variant="outline-danger" onClick={handleLogout}>
              {t('chat.logout')}
            </Button>
          ) : (
            <Nav.Link as={Link} to="/" className="text-decoration-none">
              {t('chat.title')}
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
