import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const ChatPage = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Чат</h4>
              <Button variant="outline-danger" onClick={handleLogout}>
                Выйти
              </Button>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">Здесь будет интерфейс чата</p>
              <p>Добро пожаловать в чат! Функционал будет добавлен на следующих этапах.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
