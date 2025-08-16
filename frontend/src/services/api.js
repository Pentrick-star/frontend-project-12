import axios from 'axios';

const API_BASE_URL = '/api';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Если токен недействителен, удаляем его и перенаправляем на страницу входа
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Авторизация пользователя
  login: async (username, password) => {
    const response = await api.post('/v1/login', { username, password });
    return response.data;
  },

  // Регистрация пользователя
  signup: async (username, password) => {
    const response = await api.post('/v1/signup', { username, password });
    return response.data;
  },

  // Проверка токена
  verifyToken: async () => {
    const response = await api.get('/v1/verify');
    return response.data;
  },
};

export const channelsAPI = {
  // Получение списка каналов
  getChannels: async () => {
    const response = await api.get('/v1/channels');
    return response.data;
  },

  // Создание канала
  createChannel: async (name) => {
    const response = await api.post('/v1/channels', { name });
    return response.data;
  },

  // Переименование канала
  renameChannel: async (channelId, name) => {
    const response = await api.patch(`/v1/channels/${channelId}`, { name });
    return response.data;
  },

  // Удаление канала
  removeChannel: async (channelId) => {
    const response = await api.delete(`/v1/channels/${channelId}`);
    return response.data;
  },
};

export const messagesAPI = {
  // Получение сообщений канала
  getMessages: async (channelId) => {
    const response = await api.get(`/v1/channels/${channelId}/messages`);
    return response.data;
  },

  // Отправка сообщения
  sendMessage: async (channelId, message) => {
    const response = await api.post(`/v1/channels/${channelId}/messages`, {
      body: message,
    });
    return response.data;
  },
};

export default api;
