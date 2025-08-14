import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { store } from '../store';
import { addMessage } from '../store/slices/messagesSlice';
import { setConnectionStatus, setConnectionError } from '../store/slices/uiSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io('/', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connected = true;
      store.dispatch(setConnectionStatus(true));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected = false;
      store.dispatch(setConnectionStatus(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      store.dispatch(setConnectionError(error.message));
      toast.error('Ошибка соединения');
    });

    this.socket.on('newMessage', (message) => {
      console.log('New message received:', message);
      store.dispatch(addMessage({
        channelId: message.channelId,
        message: message,
      }));
    });

    this.socket.on('channelCreated', (channel) => {
      console.log('Channel created:', channel);
      // Можно добавить обработку создания канала
    });

    this.socket.on('channelRemoved', (channelId) => {
      console.log('Channel removed:', channelId);
      // Можно добавить обработку удаления канала
    });

    this.socket.on('channelRenamed', (channel) => {
      console.log('Channel renamed:', channel);
      // Можно добавить обработку переименования канала
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  sendMessage(channelId, message) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.connected) {
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
    if (this.socket && this.connected) {
      this.socket.emit('joinChannel', { channelId });
    }
  }

  leaveChannel(channelId) {
    if (this.socket && this.connected) {
      this.socket.emit('leaveChannel', { channelId });
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new SocketService();
