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
    try {
      const response = await api.post('/v1/login', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Проверка токена
  verifyToken: async () => {
    try {
      const response = await api.get('/v1/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const channelsAPI = {
  // Получение списка каналов
  getChannels: async () => {
    try {
      const response = await api.get('/v1/channels');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
