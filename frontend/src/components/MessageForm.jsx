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
    <div className="d-flex align-items-center border rounded-pill p-2" style={{ backgroundColor: '#ffffff', borderColor: '#80bdff', borderWidth: '2px' }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={t('chat.messagePlaceholder')}
        disabled={loading}
        className="flex-grow-1 border-0 px-3"
        style={{ 
          backgroundColor: 'transparent',
          fontSize: '0.9rem',
          outline: 'none',
          color: '#333333'
        }}
        name="body"
        aria-label={t('chat.newMessage')}
      />
      <button 
        type="submit" 
        disabled={loading || !message.trim()} 
        className="btn p-0 d-flex align-items-center justify-content-center"
        style={{ 
          backgroundColor: 'transparent',
          border: 'none',
          width: '32px',
          height: '32px',
          borderRadius: '50%'
        }}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          style={{ 
            color: message.trim() ? '#007bff' : '#6c757d' 
          }}
        >
          <path 
            d="M2 21L23 12L2 3V10L17 12L2 14V21Z" 
            fill="currentColor"
          />
        </svg>
        <span className="visually-hidden">{t('common.send')}</span>
      </button>
    </div>
  );
};

export default MessageForm;
