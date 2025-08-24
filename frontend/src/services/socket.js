import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    // В тестовой среде используем текущий хост
    const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    const wsUrl = isTest ? window.location.origin : 'http://localhost:5001';
    
    console.log('Connecting to WebSocket:', wsUrl);
    console.log('Current socket state:', this.socket ? 'exists' : 'null');
    
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
      
      // Добавляем обработчик для проверки подключения
      this.socket.on('connect', () => {
        console.log('WebSocket connected successfully');
      });
      
      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
      });
    } catch (error) {
      console.log('WebSocket connection failed:', error);
    }

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
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
      console.log('Setting up newMessage listener');
      this.socket.on('newMessage', (message) => {
        console.log('WebSocket newMessage event received:', message);
        callback(message);
      });
    } else {
      console.log('Socket not available for newMessage listener');
    }
  }

  onNewChannel(callback) {
    if (this.socket) {
      console.log('Setting up newChannel listener');
      this.socket.on('newChannel', (data) => {
        console.log('WebSocket newChannel event received:', data);
        callback(data);
      });
    } else {
      console.log('Socket not available for newChannel listener');
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
