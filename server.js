const express = require('express');
const path = require('path');

const app = express();

// Middleware для парсинга JSON
app.use(express.json());

// Раздача статических файлов из frontend/dist
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Простые API эндпоинты для тестов
app.post('/api/v1/signup', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // Простая валидация
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  // Имитация успешной регистрации
  const token = 'test-token-' + Date.now();
  res.json({ token, username });
});

app.post('/api/v1/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // Имитация успешного входа
  const token = 'test-token-' + Date.now();
  res.json({ token, username });
});

app.get('/api/v1/channels', (req, res) => {
  res.json([
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: false }
  ]);
});

app.get('/api/v1/messages', (req, res) => {
  res.json([]);
});

app.post('/api/v1/messages', (req, res) => {
  const { body, channelId } = req.body;
  
  if (!body || !channelId) {
    return res.status(400).json({ error: 'Message body and channelId are required' });
  }
  
  const message = {
    id: Date.now(),
    body,
    channelId,
    username: 'test-user',
    createdAt: new Date().toISOString()
  };
  
  res.json(message);
});

app.post('/api/v1/channels', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Channel name is required' });
  }
  
  const channel = {
    id: Date.now(),
    name,
    removable: true
  };
  
  res.json(channel);
});

// Все остальные запросы направляем на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
