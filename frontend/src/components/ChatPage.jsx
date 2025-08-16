import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';
import MessageForm from './MessageForm';
import Header from './Header';
import socketService from '../services/socket';

const ChatPage = ({ onLogout }) => {
  const { currentChannelId } = useSelector((state) => state.channels);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Подключаемся к WebSocket
      socketService.connect(token);
    }
  }, []);

  useEffect(() => {
    if (currentChannelId) {
      // Присоединяемся к каналу через WebSocket
      socketService.joinChannel(currentChannelId);
    }
  }, [currentChannelId]);

  const handleLogout = () => {
    socketService.disconnect();
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <>
      <Header onLogout={handleLogout} isAuthenticated={true} />
      <Container fluid className="h-100 p-0">
        <Row className="h-100 g-0">
          {/* Сайдбар с каналами */}
          <Col md={3} className="border-end bg-light">
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">Hexlet Chat</h5>
                </div>
              </div>
            </div>
            <div className="p-3">
              <ChannelsList />
            </div>
          </Col>

          {/* Основная область чата */}
          <Col md={9} className="d-flex flex-column h-100">
            <Card className="h-100 border-0 rounded-0">
              <Card.Body className="p-0 d-flex flex-column">
                <div className="flex-grow-1 overflow-hidden">
                  <MessagesList />
                </div>
                <MessageForm />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChatPage;
