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
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <ChannelsList />
        <div className="chat-main">
          <div className="chat-header">
            <h3>{currentChannel ? `# ${currentChannel.name}` : t('chat.selectChannel')}</h3>
          </div>
          <div 
            className="chat-messages"
            style={{
              color: '#333 !important',
              backgroundColor: 'white !important'
            }}
          >
            {channelMessages.length === 0 ? (
              <div className="no-messages">{t('chat.noMessages')}</div>
            ) : (
              channelMessages.map((message) => (
                <div 
                  key={message.id} 
                  className="message"
                  style={{ backgroundColor: 'white', color: 'black' }}
                >
                  <strong style={{ color: 'black' }}>{message.username || 'Unknown'}:</strong> 
                  <span style={{ color: 'black' }}>{message.body}</span>
                </div>
              ))
            )}
          </div>
          <MessageForm />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
