import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchChannels } from '../store/channelsSlice';
import { fetchMessages, addMessage } from '../store/messagesSlice';
import ChannelsList from '../components/ChannelsList';
import MessageForm from '../components/MessageForm';
import socketService from '../services/socket';
import { useAuth } from '../hooks/useAuth';
import { pluralizeMessages } from '../utils/pluralize';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { items: channels, currentChannelId, loading: channelsLoading } = useSelector((state) => state.channels);
  const { items: messages, loading: messagesLoading } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      socketService.connect(token);

      socketService.onNewMessage((newMessage) => {
        dispatch(addMessage(newMessage));
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [token, dispatch]);

  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => message.channelId === currentChannelId);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
  <div className="container mt-5 mb-5 shadow chat-container" style={{ backgroundColor: '#f5f7fa', minHeight: '80vh', display: 'flex', flexDirection: 'row', height: '80vh', borderRadius: '14px', padding: '0', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      {/* Sidebar */}
  <div className="d-flex flex-column border-end" style={{ width: '270px', backgroundColor: '#f8f9fa', borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px' }}>
        <ChannelsList />
      </div>
      {/* Main chat area */}
      <div className="d-flex flex-column flex-grow-1 h-100" style={{ minWidth: 0 }}>
        {/* Header */}
        <div className="p-3 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ color: '#333333', fontWeight: 'bold', fontSize: '1.15rem', lineHeight: '1.1' }}>
              {currentChannel ? `# ${currentChannel.name}` : t('chat.selectChannel')}
            </span>
            {currentChannel && (
              <span style={{ color: '#6c757d', fontSize: '0.88rem', marginTop: '1px', fontWeight: 400 }}>
                {channelMessages.length} {pluralizeMessages(channelMessages.length)}
              </span>
            )}
          </div>
        </div>
        {/* Messages */}
        <div className="flex-grow-1 overflow-auto p-3 chat-messages" id="messages-box" style={{ backgroundColor: '#ffffff', minHeight: 0 }}>
          {channelMessages.length === 0 ? (
            <div></div>
          ) : (
            channelMessages.map((message) => (
              <div key={message.id} className="text-break mb-2" style={{ lineHeight: '1.4' }}>
                <span style={{ fontWeight: 600, color: '#333333', marginRight: '2px' }}>{message.username || 'Unknown'}:</span>
                <span style={{ color: '#333333', fontWeight: 400 }}>{message.body}</span>
              </div>
            ))
          )}
        </div>
        {/* Footer (input) */}
        <div className="p-3 chat-footer" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #dee2e6' }}>
          <MessageForm />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
