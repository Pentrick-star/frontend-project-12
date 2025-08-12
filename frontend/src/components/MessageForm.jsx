import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { sendMessage } from '../store/slices/messagesSlice';
import socketService from '../services/socket';

const MessageForm = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { isConnected } = useSelector((state) => state.ui);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !currentChannelId || !isConnected) {
      return;
    }

    setIsSending(true);
    
    try {
      // Отправляем сообщение через WebSocket
      await socketService.sendMessage(currentChannelId, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Если WebSocket не работает, пробуем через HTTP
      try {
        await dispatch(sendMessage({ 
          channelId: currentChannelId, 
          message: message.trim() 
        })).unwrap();
        setMessage('');
      } catch (httpError) {
        console.error('HTTP fallback also failed:', httpError);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-form p-3 border-top">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.enterMessage')}
            disabled={!currentChannelId || !isConnected || isSending}
            maxLength={1000}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!message.trim() || !currentChannelId || !isConnected || isSending}
          >
            {isSending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {t('chat.sending')}
              </>
            ) : (
              t('chat.send')
            )}
          </Button>
        </InputGroup>
        {!isConnected && (
          <small className="text-danger mt-1 d-block">
            {t('chat.connectionWarning')}
          </small>
        )}
      </Form>
    </div>
  );
};

export default MessageForm;
