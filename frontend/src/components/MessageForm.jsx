import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addMessage } from '../store/slices/messagesSlice';
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
    
    if (!message.trim()) {
      toast.error('Введите сообщение');
      return;
    }
    
    if (!currentChannelId || currentChannelId <= 0) {
      toast.error('Выберите канал для отправки сообщения');
      return;
    }

    console.log('Submitting message:', message.trim());
    console.log('Current channel ID:', currentChannelId);
    console.log('Is connected:', isConnected);
    
    setIsSending(true);
    
    try {
      const messageText = message.trim();
      
      if (isConnected) {
        console.log('Trying to send via WebSocket');
        // Пытаемся отправить через WebSocket
        try {
          await socketService.sendMessage(currentChannelId, messageText);
          setMessage('');
          toast.success(t('notifications.messageSent'));
        } catch (wsError) {
          console.error('WebSocket error:', wsError);
          // Fallback на демо режим
          throw wsError;
        }
      } else {
        console.log('Using demo mode - adding message locally');
        // Демо режим - добавляем сообщение локально
        const newMessage = {
          id: Date.now(),
          body: messageText,
          username: 'admin', // Используем имя текущего пользователя
          channelId: currentChannelId,
          createdAt: new Date().toISOString(),
        };
        
        console.log('New message object:', newMessage);
        
        // Добавляем сообщение в store
        dispatch(addMessage({
          channelId: currentChannelId,
          message: newMessage,
        }));
        
        console.log('Message dispatched to store');
        setMessage('');
        toast.success(t('notifications.messageSent'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('notifications.messageError'));
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
            disabled={!currentChannelId || isSending}
            maxLength={1000}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!message.trim() || !currentChannelId || isSending}
          >
            {isSending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {t('chat.sending')}
              </>
            ) : (
              t('interface.send')
            )}
          </Button>
        </InputGroup>
        {!isConnected && (
          <small className="text-info mt-1 d-block">
            Демо режим - сообщения сохраняются локально
          </small>
        )}
      </Form>
    </div>
  );
};

export default MessageForm;
