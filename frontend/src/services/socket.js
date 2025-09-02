import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    // Подключаемся к backend на текущем origin (работает в тестах и в проде)
    const { protocol, host } = window.location;
    const wsUrl = `${protocol}//${host}`;
    
    try {
      this.socket = io(wsUrl, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        forceNew: true,
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Добавляем обработчики ошибок
      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });
    } catch (error) {
      console.error('Socket connection failed:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      // Убираем предыдущий обработчик, если он есть
      this.socket.off('newMessage');
      this.socket.on('newMessage', (message) => {
        callback(message);
      });
    }
  }

  onNewChannel(callback) {
    if (this.socket) {
      // Убираем предыдущий обработчик, если он есть
      this.socket.off('newChannel');
      this.socket.on('newChannel', (data) => {
        callback(data);
      });
    }
  }

  onRemoveChannel(callback) {
    if (this.socket) {
      // Убираем предыдущий обработчик, если он есть
      this.socket.off('removeChannel');
      this.socket.on('removeChannel', callback);
    }
  }

  onRenameChannel(callback) {
    if (this.socket) {
      // Убираем предыдущий обработчик, если он есть
      this.socket.off('renameChannel');
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