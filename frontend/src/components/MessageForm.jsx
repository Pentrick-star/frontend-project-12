import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sendMessage } from '../store/messagesSlice';
import { filterProfanity } from '../utils/profanityFilter';
import { useAuth } from '../hooks/useAuth';

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

    try {
      const filteredMessage = filterProfanity(message.trim());
      await dispatch(sendMessage({
        body: filteredMessage,
        channelId: currentChannelId,
        username: user?.username || 'Unknown',
      })).unwrap();
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
    <form onSubmit={handleSubmit} className="py-3 border rounded-3" style={{ backgroundColor: '#f8f9fa', borderColor: '#007bff' }}>
      <div className="input-group">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('chat.messagePlaceholder')}
          disabled={loading}
          className="border-0 p-0 ps-2 form-control"
          style={{ backgroundColor: 'transparent' }}
          name="body"
          aria-label={t('chat.newMessage')}
        />
        <button 
          type="submit" 
          disabled={loading || !message.trim()} 
          className="btn btn-group-vertical"
          style={{ 
            backgroundColor: '#f8f9fa', 
            borderColor: '#007bff',
            color: '#6c757d'
          }}
        >
          <i className="bi bi-arrow-up-circle"></i>
          <span className="visually-hidden">{t('common.send')}</span>
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
