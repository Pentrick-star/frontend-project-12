import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { filterProfanity } from '../utils/profanityFilter';
import socketService from '../services/socket';
import { addMessage } from '../store/messagesSlice';

const MessageForm = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { loading } = useSelector((state) => state.messages);
  const user = useSelector((state) => state.auth.user);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChannelId) return;

    try {
      const filteredMessage = filterProfanity(message.trim());
      const username = user?.login || user?.username || user?.name;
      
      if (!username) {
        console.error('No username found for user:', user);
        return;
      }
      
      const messageData = {
        body: filteredMessage,
        channelId: currentChannelId,
        username,
      };
      
      socketService.emit('newMessage', messageData, (response) => {
        if (response.status === 'ok') {
          dispatch(addMessage(response.data));
        }
      });
      
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