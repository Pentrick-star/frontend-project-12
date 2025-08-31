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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChannelId) return;

    console.log('🚀 === MESSAGE FORM DEBUG ===');
    console.log('👤 Current user state:', user);
    console.log('🔑 User object keys:', Object.keys(user || {}));
    console.log('📝 User.username:', user?.username);
    console.log('📝 User.name:', user?.name);
    console.log('📝 User.login:', user?.login);
    console.log('🎯 Current channel ID:', currentChannelId);

    try {
      const filteredMessage = filterProfanity(message.trim());
      const username = user?.username || user?.name || user?.login || 'Unknown';
      console.log('✅ Extracted username:', username);
      
      const messageData = {
        body: filteredMessage,
        channelId: currentChannelId,
        username,
      };
      console.log('📤 Message data being sent:', messageData);
      
      socketService.emit('newMessage', messageData);
      
      const localMessage = {
        id: Date.now(),
        ...messageData,
        createdAt: new Date().toISOString(),
      };
      console.log('💾 Local message being added:', localMessage);
      dispatch(addMessage(localMessage));
      setMessage('');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
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
