import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchChannels } from '../store/channelsSlice';
import { fetchMessages, addMessage } from '../store/messagesSlice';
import ChannelsList from '../components/ChannelsList';
import MessageForm from '../components/MessageForm';
import socketService from '../services/socket';
import { useAuth } from '../hooks/useAuth';

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
    <div className="container-fluid h-100" style={{ backgroundColor: '#f5f7fa' }}>
      <div className="row h-100 g-0">
        <div className="col-4 col-md-2">
          <div className="h-100 border-end" style={{ backgroundColor: '#ffffff' }}>
            <ChannelsList />
          </div>
        </div>
        <div className="col h-100 d-flex flex-column">
          <div className="p-3 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
            <div>
              <b style={{ color: '#333333' }}>
                {currentChannel ? `# ${currentChannel.name}` : t('chat.selectChannel')}
              </b>
            </div>
            {currentChannel && (
              <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                {channelMessages.length} {t('chat.noMessages')}
              </div>
            )}
          </div>
          <div className="flex-grow-1 overflow-auto px-4 py-3" id="messages-box" style={{ backgroundColor: '#ffffff' }}>
            {channelMessages.length === 0 ? (
              <div></div>
            ) : (
              channelMessages.map((message) => (
                <div key={message.id} className="text-break mb-2">
                  <b style={{ color: '#333333' }}>{message.username || 'Unknown'}</b>
                  {': '}
                  <span style={{ color: '#333333' }}>{message.body}</span>
                </div>
              ))
            )}
          </div>
          <div className="p-3" style={{ backgroundColor: '#ffffff' }}>
            <MessageForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
