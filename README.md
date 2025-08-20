### Hexlet tests and linter status:
[![Actions Status](https://github.com/Pentrick-star/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Pentrick-star/frontend-project-12/actions)


### 📦 Установка и запуск

#### Локальная разработка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/Pentrick-star/frontend-project-12.git
cd frontend-project-12
```

2. **Установите зависимости:**
```bash
make install
```

3. **Соберите фронтенд:**
```bash
make build
```

4. **Запустите сервер:**
```bash
make start
```

Приложение будет доступно по адресу: http://localhost:5001

#### Альтернативный запуск для разработки

Для разработки с hot reload:
```bash
cd frontend && npm run dev
```

### 🔧 Структура проекта

```
frontend-project-12/
├── frontend/                 # React приложение
│   ├── src/
│   │   ├── components/      # Переиспользуемые компоненты
│   │   │   ├── Header.jsx
│   │   │   ├── MessageForm.jsx
│   │   │   ├── ChannelsList.jsx
│   │   │   ├── AddChannelModal.jsx
│   │   │   ├── RenameChannelModal.jsx
│   │   │   ├── RemoveChannelModal.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/          # Страницы приложения
│   │   │   ├── ChatPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── store/          # Redux store
│   │   │   ├── index.js
│   │   │   ├── authSlice.js
│   │   │   ├── channelsSlice.js
│   │   │   └── messagesSlice.js
│   │   ├── contexts/       # React контексты
│   │   │   └── AuthContext.jsx
│   │   ├── services/       # Сервисы
│   │   │   └── socket.js
│   │   ├── utils/          # Утилиты
│   │   │   ├── profanityFilter.js
│   │   │   └── rollbar.js
│   │   ├── i18n/          # Интернационализация
│   │   │   ├── index.js
│   │   │   └── locales/
│   │   │       └── ru.json
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
├── Makefile
└── README.md
```

### 🎯 Основные функции

#### Аутентификация
- Вход с использованием имени пользователя и пароля
- Регистрация новых пользователей
- Автоматическое перенаправление на чат после успешной авторизации
- Защищенные маршруты для неавторизованных пользователей

#### Чат
- Отправка и получение сообщений в реальном времени
- Фильтрация сообщений по каналам
- Поддержка Enter для быстрой отправки сообщений
- Индикаторы загрузки и состояния
- Фильтрация нецензурных слов в сообщениях

#### Управление каналами
- Создание новых каналов (3-20 символов)
- Переименование существующих каналов
- Удаление каналов с подтверждением
- Автоматическое переключение на канал General при удалении текущего
- Защита системных каналов (general, random) от удаления
- Фильтрация нецензурных слов в названиях каналов

#### Пользовательский интерфейс
- Современный и интуитивный дизайн
- Модальные окна для управления каналами
- Выпадающие меню для действий с каналами
- Адаптивная верстка
- Обработка ошибок с понятными сообщениями
- Всплывающие уведомления для обратной связи

#### Мониторинг и безопасность
- Автоматический мониторинг ошибок через Rollbar
- Фильтрация нецензурного контента
- Валидация всех пользовательских данных

### 🔐 API Endpoints

Приложение использует следующие API endpoints:

- `POST /api/v1/login` - авторизация
- `POST /api/v1/signup` - регистрация
- `GET /api/v1/channels` - получение списка каналов
- `POST /api/v1/channels` - создание канала
- `DELETE /api/v1/channels/:id` - удаление канала
- `PATCH /api/v1/channels/:id` - переименование канала
- `GET /api/v1/messages` - получение сообщений
- `POST /api/v1/messages` - отправка сообщения

### 🌐 WebSocket Events

- `newMessage` - новое сообщение
- `newChannel` - новый канал
- `removeChannel` - удаление канала
- `renameChannel` - переименование канала
