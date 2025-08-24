import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchChannels, addChannel, removeChannelById, updateChannel, setCurrentChannel } from '../store/channelsSlice';
import { fetchMessages, addMessage } from '../store/messagesSlice';
import { useAuth } from '../hooks/useAuth';
import ChannelsList from '../components/ChannelsList';
import MessageForm from '../components/MessageForm';
import socketService from '../services/socket';

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
    if (!token) {
      console.log('No token available for WebSocket connection');
      return;
    }

    try {
      console.log('Attempting WebSocket connection with token');
      // Проверяем, не подключены ли мы уже
      if (socketService.socket && socketService.socket.connected) {
        console.log('WebSocket already connected, skipping connection');
        return;
      }
      socketService.connect(token);

      const handleNewMessage = (newMessage) => {
        console.log('Received new message via WebSocket:', newMessage);
        dispatch(addMessage(newMessage));
      };

      const handleNewChannel = (newChannel) => {
        console.log('Received new channel via WebSocket:', newChannel);
        dispatch(addChannel(newChannel));
        dispatch(setCurrentChannel(newChannel.id));
        console.log('Set current channel from WebSocket to:', newChannel.id);
      };

      const handleRemoveChannel = (channelId) => {
        console.log('Received remove channel via WebSocket:', channelId);
        dispatch(removeChannelById(channelId));
      };

      const handleRenameChannel = (updatedChannel) => {
        console.log('Received rename channel via WebSocket:', updatedChannel);
        dispatch(updateChannel(updatedChannel));
      };

      socketService.onNewMessage(handleNewMessage);
      socketService.onNewChannel(handleNewChannel);
      socketService.onRemoveChannel(handleRemoveChannel);
      socketService.onRenameChannel(handleRenameChannel);

      return () => {
        console.log('Disconnecting WebSocket');
        socketService.disconnect();
      };
    } catch (error) {
      console.log('WebSocket connection failed, continuing without real-time updates:', error);
    }
  }, [token]); // Только token в зависимостях!

  // Добавляем обработку ошибок для API запросов
  useEffect(() => {
    if (!token) {
      console.log('No token available, skipping data fetch');
      return;
    }
    
    try {
      console.log('Fetching initial channels and messages with token');
      dispatch(fetchChannels());
      dispatch(fetchMessages());
    } catch (error) {
      console.log('Failed to fetch initial data:', error);
    }
  }, [token, dispatch]);

  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => {
    return message.channelId === currentChannelId;
  });

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
      <div className="row g-0 h-100">
        <div className="col-4 col-md-3">
          <div className="h-100 border-end bg-light">
            <ChannelsList />
          </div>
        </div>
        <div className="col-8 col-md-9 d-flex flex-column h-100">
          <div className="p-3 border-bottom bg-light">
            <div>
              <b>
                {currentChannel ? `# ${currentChannel.name}` : 'Выберите канал'}
              </b>
            </div>
            {currentChannel && (
              <div className="text-muted small">
                {channelMessages.length} {t('messages_many')}
              </div>
            )}
          </div>
          <div className="flex-grow-1 overflow-auto p-3" id="messages-box">
            {channelMessages.length === 0 ? (
              <div></div>
            ) : (
              channelMessages.map((message) => (
                <div key={message.id} className="text-break mb-2">
                  <b>{message.username || 'Unknown'}:</b>
                  {' '}
                  <span>{message.body}</span>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-top bg-white">
            <MessageForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
