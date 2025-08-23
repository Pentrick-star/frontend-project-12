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
      <div className="row h-100">
        <div className="col-4 col-md-2 border-end px-0" style={{ backgroundColor: '#f8f9fa' }}>
          <ChannelsList />
        </div>
        <div className="col h-100 d-flex flex-column" style={{ backgroundColor: '#ffffff' }}>
          <div className="mb-4 p-3 shadow-sm small" style={{ backgroundColor: '#f8f9fa' }}>
            <p className="m-0">
              <b style={{ color: '#333333' }}>{currentChannel ? `# ${currentChannel.name}` : t('chat.selectChannel')}</b>
              {currentChannel && (
                <span style={{ color: '#6c757d' }} className="ms-2">
                  {channelMessages.length} {t('chat.noMessages')}
                </span>
              )}
            </p>
          </div>
          <div className="chat-messages overflow-auto px-5" id="messages-box">
            {channelMessages.length === 0 ? (
              <div className="text-center" style={{ color: '#6c757d' }}></div>
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
          <div className="mt-auto px-5 py-3">
            <MessageForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
