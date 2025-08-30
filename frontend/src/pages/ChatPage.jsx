import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchChannels, addChannel, removeChannelById, updateChannel, setCurrentChannel } from '../store/channelsSlice';
import { fetchMessages, addMessage } from '../store/messagesSlice';
import ChannelsList from '../components/ChannelsList';
import MessageForm from '../components/MessageForm';
import socketService from '../services/socket';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);
  const { items: channels, currentChannelId, loading: channelsLoading } = useSelector((state) => state.channels);
  const { items: messages, loading: messagesLoading } = useSelector((state) => state.messages);

  useEffect(() => {
    if (!token) return;
    
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [token, dispatch]);

  useEffect(() => {
    if (!token) {
      return;
    }

    try {
      socketService.connect(token);
      
      const handleNewMessage = (newMessage) => {
        console.log('=== WEBSOCKET MESSAGE DEBUG ===');
        console.log('New message received via WebSocket:', newMessage);
        console.log('Message fields:', Object.keys(newMessage));
        console.log('Message username field:', newMessage.username);
        console.log('Message name field:', newMessage.name);
        console.log('Message login field:', newMessage.login);
        console.log('Message user object:', newMessage.user);
        if (newMessage.user) {
          console.log('User object keys:', Object.keys(newMessage.user));
          console.log('User.username:', newMessage.user.username);
          console.log('User.name:', newMessage.user.name);
          console.log('User.login:', newMessage.user.login);
        }
        
        // Убеждаемся, что у сообщения есть правильное имя пользователя
        // Проверяем все возможные поля для имени пользователя
        let username = 'Unknown';
        if (newMessage.username) {
          username = newMessage.username;
        } else if (newMessage.name) {
          username = newMessage.name;
        } else if (newMessage.login) {
          username = newMessage.login;
        } else if (newMessage.user && newMessage.user.username) {
          username = newMessage.user.username;
        } else if (newMessage.user && newMessage.user.name) {
          username = newMessage.user.name;
        } else if (newMessage.user && newMessage.user.login) {
          username = newMessage.user.login;
        } else if (currentUser && currentUser.username) {
          // Если в сообщении нет имени, используем имя текущего пользователя
          username = currentUser.username;
        } else if (currentUser && currentUser.name) {
          username = currentUser.name;
        } else if (currentUser && currentUser.login) {
          username = currentUser.login;
        }
        
        console.log('Current user from Redux:', currentUser);
        console.log('Extracted username:', username);
        
        const messageWithUsername = {
          ...newMessage,
          username,
        };
        console.log('Message with username being dispatched:', messageWithUsername);
        dispatch(addMessage(messageWithUsername));
      };

      const handleNewChannel = (newChannel) => {
        dispatch(addChannel(newChannel));
        dispatch(setCurrentChannel(newChannel.id));
      };

      const handleRemoveChannel = (channelId) => {
        dispatch(removeChannelById(channelId));
      };

      const handleRenameChannel = (updatedChannel) => {
        dispatch(updateChannel(updatedChannel));
      };

      socketService.onNewMessage(handleNewMessage);
      socketService.onNewChannel(handleNewChannel);
      socketService.onRemoveChannel(handleRemoveChannel);
      socketService.onRenameChannel(handleRenameChannel);
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }

    return () => {
      socketService.disconnect();
    };
  }, [token, dispatch]);

  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => message.channelId === currentChannelId);
  
  // Логируем сообщения для отладки
  console.log('ChatPage - Current messages:', channelMessages);

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
            {messagesLoading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Загрузка сообщений...</span>
                </div>
              </div>
            ) : channelMessages.length === 0 ? (
              <div></div>
            ) : (
              channelMessages.map((message) => {
                // Используем ту же логику извлечения имени пользователя
                let username = 'Unknown';
                if (message.username) {
                  username = message.username;
                } else if (message.name) {
                  username = message.name;
                } else if (message.login) {
                  username = message.login;
                } else if (message.user && message.user.username) {
                  username = message.user.username;
                } else if (message.user && message.user.name) {
                  username = message.user.name;
                } else if (message.user && message.user.login) {
                  username = message.user.login;
                } else if (currentUser && currentUser.username) {
                  // Если в сообщении нет имени, используем имя текущего пользователя
                  username = currentUser.username;
                } else if (currentUser && currentUser.name) {
                  username = currentUser.name;
                } else if (currentUser && currentUser.login) {
                  username = currentUser.login;
                }
                
                console.log('=== MESSAGE RENDERING DEBUG ===');
                console.log('Rendering message:', message);
                console.log('Message ID:', message.id);
                console.log('Message body:', message.body);
                console.log('Message channelId:', message.channelId);
                console.log('Message username for rendering:', username);
                console.log('Message user object:', message.user);
                console.log('Current user from Redux:', currentUser);
                
                return (
                  <div key={message.id} className="text-break mb-2">
                    <b>{username}:</b>
                    {' '}
                    <span>{message.body}</span>
                  </div>
                );
              })
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
