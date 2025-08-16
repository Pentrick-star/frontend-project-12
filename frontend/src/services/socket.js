import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { store } from '../store';
import { addMessage } from '../store/slices/messagesSlice';
import { addChannel, removeChannel, renameChannel } from '../store/slices/channelsSlice';
import { setConnectionStatus, setConnectionError } from '../store/slices/uiSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    try {
      this.socket = io('http://localhost:5001', {
        path: '/socket.io/',
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        timeout: 5000, // 5 секунд таймаут
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.isConnected = true;
        store.dispatch(setConnectionStatus(true));
        store.dispatch(setConnectionError(null));
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.isConnected = false;
        store.dispatch(setConnectionStatus(false));
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        // Не меняем состояние соединения при ошибке WebSocket
        console.log('WebSocket connection failed, staying in demo mode');
        toast.error('WebSocket недоступен, используется демо режим');
      });

      // Таймаут для подключения
      setTimeout(() => {
        if (!this.isConnected) {
          console.log('WebSocket connection timeout, staying in demo mode');
          // Не меняем состояние, оставляем демо режим
        }
      }, 5000);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnected = false;
      store.dispatch(setConnectionStatus(false));
      store.dispatch(setConnectionError('Ошибка создания соединения'));
    }

    this.socket.on('newMessage', (message) => {
      console.log('New message received:', message);
      store.dispatch(addMessage({
        channelId: message.channelId,
        message: message,
      }));
    });

    this.socket.on('channelCreated', (channel) => {
      console.log('Channel created:', channel);
      store.dispatch(addChannel(channel));
    });

    this.socket.on('channelRemoved', (channelId) => {
      console.log('Channel removed:', channelId);
      store.dispatch(removeChannel(channelId));
    });

    this.socket.on('channelRenamed', (channel) => {
      console.log('Channel renamed:', channel);
      store.dispatch(renameChannel({ id: channel.id, name: channel.name }));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  sendMessage(channelId, message) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('newMessage', { channelId, body: message }, (response) => {
        if (response.status === 'ok') {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Failed to send message'));
        }
      });
    });
  }

  joinChannel(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinChannel', { channelId });
    }
  }

  leaveChannel(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveChannel', { channelId });
    }
  }

  isConnected() {
    return this.isConnected;
  }
}

export default new SocketService();
