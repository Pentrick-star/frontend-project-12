import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, ListGroup } from 'react-bootstrap';

const MessagesList = () => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);
  const { currentChannelId, channels } = useSelector((state) => state.channels);
  const { messages, loading } = useSelector((state) => state.messages);
  const { isConnected } = useSelector((state) => state.ui);

  const currentMessages = messages[currentChannelId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages.length]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка сообщений...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container d-flex flex-column h-100">
      <div className="messages-header p-3 border-bottom">
        <h5 className="mb-0">
          {currentChannelId ? `# ${channels.find(ch => ch.id === currentChannelId)?.name || t('chat.selectChannel')}` : t('chat.selectChannel')}
        </h5>
        {!isConnected && (
          <small className="text-danger">
            {t('chat.connectionError')}
          </small>
        )}
      </div>
      
      <div className="messages-list flex-grow-1 overflow-auto p-3">
        {currentMessages.length === 0 ? (
          <div className="text-center text-muted mt-4">
            <p>{t('chat.noMessages')}</p>
            <p>{t('chat.startConversation')}</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {currentMessages.map((message) => (
              <ListGroup.Item
                key={message.id}
                className="border-0 px-0 py-2"
              >
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {message.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <strong className="me-2">{message.username || t('chat.selectChannel')}</strong>
                      <small className="text-muted">
                        {formatTime(message.createdAt)}
                      </small>
                    </div>
                    <div className="message-text">
                      {message.body}
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesList;
