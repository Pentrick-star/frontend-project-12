import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';
import MessageForm from './MessageForm';
import ConnectionStatus from './ConnectionStatus';
import DemoMode from './DemoMode';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchMessages } from '../store/slices/messagesSlice';
import socketService from '../services/socket';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { connectionError } = useSelector((state) => state.ui);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Подключаемся к WebSocket
      socketService.connect(token);
      
      // Загружаем каналы
      dispatch(fetchChannels()).catch((error) => {
        console.error('Error fetching channels:', error);
        toast.error(t('notifications.dataLoadError'));
      });
    }
  }, [dispatch, t]);

  useEffect(() => {
    if (currentChannelId) {
      // Загружаем сообщения для текущего канала
      dispatch(fetchMessages(currentChannelId)).catch((error) => {
        console.error('Error fetching messages:', error);
        toast.error(t('notifications.dataLoadError'));
      });
      
      // Присоединяемся к каналу через WebSocket
      socketService.joinChannel(currentChannelId);
    }
  }, [currentChannelId, dispatch, t]);

  return (
    <>
      <Container fluid className="h-100 p-0">
        <Row className="h-100 g-0">
          {/* Сайдбар с каналами */}
          <Col md={3} className="border-end bg-light">
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">Hexlet Chat</h5>
                  <ConnectionStatus />
                </div>
              </div>
              {connectionError && (
                <Alert variant="danger" className="mt-2 py-2">
                  <small>{connectionError}</small>
                </Alert>
              )}
            </div>
            <div className="p-3">
              <ChannelsList />
            </div>
          </Col>

          {/* Основная область чата */}
          <Col md={9} className="d-flex flex-column h-100">
            <Card className="h-100 border-0 rounded-0">
              <Card.Body className="p-0 d-flex flex-column">
                <DemoMode />
                <MessagesList />
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
