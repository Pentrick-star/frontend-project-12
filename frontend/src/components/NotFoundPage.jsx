import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <h1 className="display-1 text-muted">404</h1>
              <h2 className="mb-3">Страница не найдена</h2>
              <p className="text-muted mb-4">
                Запрашиваемая страница не существует или была перемещена.
              </p>
              <Button variant="primary" onClick={handleGoHome}>
                Вернуться на главную
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
