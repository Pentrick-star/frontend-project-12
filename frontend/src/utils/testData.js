// Простые тестовые данные для учебного проекта

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
];

export const mockMessages = {
  1: [
    {
      id: 1,
      body: 'Привет всем!',
      username: 'admin',
      channelId: 1,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      body: 'Как дела?',
      username: 'user1',
      channelId: 1,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
  2: [
    {
      id: 3,
      body: 'Кто-нибудь здесь?',
      username: 'user2',
      channelId: 2,
      createdAt: new Date(Date.now() - 900000).toISOString(),
    },
  ],
};

// Простая функция для добавления сообщения
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
