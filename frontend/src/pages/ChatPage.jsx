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
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-4 col-md-2 border-end px-0 bg-light">
          <ChannelsList />
        </div>
        <div className="col h-100 d-flex flex-column">
          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="m-0">
              <b>{currentChannel ? `# ${currentChannel.name}` : t('chat.selectChannel')}</b>
            </p>
          </div>
          <div className="chat-messages overflow-auto px-5" id="messages-box">
            {channelMessages.length === 0 ? (
              <div className="text-center text-muted">{t('chat.noMessages')}</div>
            ) : (
              channelMessages.map((message) => (
                <div key={message.id} className="text-break mb-2">
                  <b>{message.username || 'Unknown'}</b>
                  {': '}
                  {message.body}
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
