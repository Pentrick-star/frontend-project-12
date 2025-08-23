import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sendMessage } from '../store/messagesSlice';
import { filterProfanity } from '../utils/profanityFilter';
import { useAuth } from '../hooks/useAuth';
import socketService from '../services/socket';

const MessageForm = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { loading } = useSelector((state) => state.messages);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChannelId) return;

    console.log('Sending message:', message.trim(), 'to channel:', currentChannelId);

    try {
      const filteredMessage = filterProfanity(message.trim());
      const result = await dispatch(sendMessage({
        body: filteredMessage,
        channelId: currentChannelId,
        username: user?.username || 'Unknown',
      })).unwrap();
      console.log('Message sent successfully:', result);
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
        aria-label={t('messagePlaceholder')}
      />
      <button 
        type="submit" 
        disabled={loading || !message.trim()} 
        className="btn btn-outline-secondary"
      >
        →
        <span className="visually-hidden">{t('messageBtnText')}</span>
      </button>
    </form>
  );
};

export default MessageForm;
