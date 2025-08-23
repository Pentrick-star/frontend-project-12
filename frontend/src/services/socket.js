import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    // Сервер чата всегда на localhost:5001
    const wsUrl = 'http://localhost:5001';
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    try {
      this.socket = io(wsUrl, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        forceNew: true,
        timeout: 10000, // Увеличиваем таймаут
      });
    } catch (error) {
      console.log('WebSocket connection failed:', error);
    }

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', (message) => {
        console.log('Received new message:', message);
        callback(message);
      });
    }
  }

  onNewChannel(callback) {
    if (this.socket) {
      this.socket.on('newChannel', callback);
    }
  }

  onRemoveChannel(callback) {
    if (this.socket) {
      this.socket.on('removeChannel', callback);
    }
  }

  onRenameChannel(callback) {
    if (this.socket) {
      this.socket.on('renameChannel', callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export default new SocketService();
