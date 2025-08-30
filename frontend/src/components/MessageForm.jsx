import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sendMessage, addMessage } from '../store/messagesSlice';
import { filterProfanity } from '../utils/profanityFilter';
import socketService from '../services/socket';

const MessageForm = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { loading } = useSelector((state) => state.messages);
  const user = useSelector((state) => state.auth.user);
  
  // Логируем состояние пользователя при каждом рендере
  console.log('MessageForm - Current user state:', user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChannelId) return;

    console.log('Current user state:', user);
    console.log('User username:', user?.username);

    try {
      const filteredMessage = filterProfanity(message.trim());
      const username = user?.username || user?.name || user?.login || 'Unknown';
      const messageData = {
        body: filteredMessage,
        channelId: currentChannelId,
        username, // теперь имя пользователя отправляется всем клиентам
      };
      // Отправляем сообщение через WebSocket
      socketService.emit('newMessage', messageData);
      // Добавляем сообщение локально для мгновенного отображения
      const localMessage = {
        id: Date.now(),
        ...messageData,
        createdAt: new Date().toISOString(),
      };
      dispatch(addMessage(localMessage));
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-group">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={t('messagePlaceholder')}
        disabled={loading}
        className="form-control"
        name="body"
        aria-label={t('newMessage')}
      />
      <button 
        type="submit" 
        disabled={loading || !message.trim()} 
        className="btn btn-outline-secondary"
      >
        {loading ? (
          <>
            <output className="spinner-border spinner-border-sm me-1" aria-hidden="true"></output>
            <span className="visually-hidden">{t('messageBtnText')}</span>
          </>
        ) : (
          <>
            →<span className="visually-hidden">{t('messageBtnText')}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default MessageForm;
