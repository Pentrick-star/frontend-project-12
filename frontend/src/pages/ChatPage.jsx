import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../store/channelsSlice';
import { fetchMessages, addMessage } from '../store/messagesSlice';
import MessageForm from '../components/MessageForm';
import socketService from '../services/socket';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
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

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => message.channelId === currentChannelId);

  if (channelsLoading || messagesLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="channels-sidebar">
          <h2>Каналы</h2>
          <div className="channels-list">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className={`channel-item ${channel.id === currentChannelId ? 'active' : ''}`}
                onClick={() => handleChannelClick(channel.id)}
              >
                # {channel.name}
              </div>
            ))}
          </div>
        </div>
        <div className="chat-main">
          <div className="chat-header">
            <h3>{currentChannel ? `# ${currentChannel.name}` : 'Выберите канал'}</h3>
          </div>
          <div className="chat-messages">
            {channelMessages.map((message) => (
              <div key={message.id} className="message">
                <strong>{message.username}:</strong> {message.body}
              </div>
            ))}
          </div>
          <MessageForm />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
