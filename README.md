# Hexlet Chat

[![Actions Status](https://github.com/Pentrick-star/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Pentrick-star/frontend-project-12/actions)

Веб-приложение для обмена сообщениями в реальном времени.

## Функциональность

- 🔐 Авторизация и регистрация пользователей
- 💬 Обмен сообщениями в реальном времени
- 📢 Управление каналами (создание, переименование, удаление)
- 🌐 Интернационализация (русский язык)
- 📱 Адаптивный дизайн

## Технологии

- **Frontend**: React, Redux Toolkit, React Router, Formik, Yup
- **Backend**: @hexlet/chat-server
- **Стили**: Bootstrap, React Bootstrap
- **WebSocket**: Socket.IO
- **Сборка**: Vite

## Установка и запуск

### Локальная разработка

```bash
# Установка зависимостей
make install

# Сборка фронтенда
make build

# Запуск сервера
make start
```

### Разработка фронтенда

```bash
cd frontend
npm run dev
```

## Структура проекта

```
frontend-project-12/
├── frontend/                 # React приложение
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── store/          # Redux store
│   │   ├── services/       # API и WebSocket сервисы
│   │   ├── i18n/          # Локализация
│   │   └── utils/         # Утилиты
│   └── package.json
├── package.json            # Корневой package.json
└── Makefile               # Команды для управления проектом
```

## API

Приложение использует API сервера @hexlet/chat-server:

- `POST /api/v1/login` - авторизация
- `POST /api/v1/signup` - регистрация
- `GET /api/v1/channels` - получение каналов
- `POST /api/v1/channels` - создание канала
- `DELETE /api/v1/channels/:id` - удаление канала
- `PATCH /api/v1/channels/:id` - переименование канала
- `POST /api/v1/channels/:id/messages` - отправка сообщения

## WebSocket

Приложение использует Socket.IO для обмена сообщениями в реальном времени:

- `newMessage` - новое сообщение
- `channelCreated` - создан новый канал
- `channelRemoved` - удален канал
- `channelRenamed` - переименован канал

## Деплой

Приложение готово к деплою на Render или другие PaaS платформы.

---

**Hexlet Chat** - учебный проект для изучения React и современных веб-технологий.