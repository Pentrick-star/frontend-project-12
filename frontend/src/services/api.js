import axios from 'axios';

// В тестах и локальной разработке используем порт 5001
// В продакшене используем относительный путь
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseURL = isLocalhost ? 'http://localhost:5001/api/v1' : '/api/v1';

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

// Перехватчик для добавления токена к запросам
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

// Перехватчик для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Редирект на логин только если мы не на странице логина или регистрации
    if (error.response?.status === 401 && 
        !window.location.pathname.includes('/login') && 
        !window.location.pathname.includes('/signup')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
