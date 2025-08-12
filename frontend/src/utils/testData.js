// Тестовые данные для демонстрации работы приложения
// В реальном приложении эти данные будут приходить с сервера

export const mockChannels = [
  {
    id: 1,
    name: 'General',
    removable: false,
  },
  {
    id: 2,
    name: 'Random',
    removable: false,
  },
  {
    id: 3,
    name: 'Help',
    removable: false,
  },
];

export const mockMessages = {
  1: [
    {
      id: 1,
      body: 'Привет всем! Добро пожаловать в чат!',
      username: 'admin',
      channelId: 1,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      body: 'Спасибо! Рад быть здесь!',
      username: 'user1',
      channelId: 1,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 3,
      body: 'Как дела у всех?',
      username: 'user2',
      channelId: 1,
      createdAt: new Date(Date.now() - 900000).toISOString(),
    },
  ],
  2: [
    {
      id: 4,
      body: 'Кто-нибудь играет в игры?',
      username: 'gamer',
      channelId: 2,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  3: [
    {
      id: 5,
      body: 'Нужна помощь с React!',
      username: 'newbie',
      channelId: 3,
      createdAt: new Date(Date.now() - 5400000).toISOString(),
    },
    {
      id: 6,
      body: 'Конечно! Что именно нужно?',
      username: 'helper',
      channelId: 3,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

// Функция для добавления нового сообщения
export const addMockMessage = (channelId, message, username = 'user') => {
  const newMessage = {
    id: Date.now(),
    body: message,
    username,
    channelId,
    createdAt: new Date().toISOString(),
  };
  
  if (!mockMessages[channelId]) {
    mockMessages[channelId] = [];
  }
  
  mockMessages[channelId].push(newMessage);
  return newMessage;
};
