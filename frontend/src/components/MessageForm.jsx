import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sendMessage } from '../store/messagesSlice';
import { filterProfanity } from '../utils/profanityFilter';

const MessageForm = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { loading } = useSelector((state) => state.messages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChannelId) return;

    try {
      const filteredMessage = filterProfanity(message.trim());
      await dispatch(sendMessage({
        body: filteredMessage,
        channelId: currentChannelId,
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
    <form onSubmit={handleSubmit} className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={t('chat.messagePlaceholder')}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !message.trim()}>
        {loading ? t('common.sending') : t('common.send')}
      </button>
    </form>
  );
};

export default MessageForm;
