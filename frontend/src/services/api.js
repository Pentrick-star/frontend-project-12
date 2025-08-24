import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  timeout: 10000,
});

// Перехватчик для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, { token: token ? 'present' : 'missing' });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Перехватчик для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status, response.data);
    return response;
  },
  (error) => {
    console.log('API Error:', error.response?.status, error.response?.data);
    // Редирект на логин только если мы не на странице логина или регистрации
    if (error.response?.status === 401 && 
        !window.location.pathname.includes('/login') && 
        !window.location.pathname.includes('/signup')) {
      console.log('Unauthorized, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
