### Hexlet tests and linter status:
[![Actions Status](https://github.com/Pentrick-star/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Pentrick-star/frontend-project-12/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability)](https://codeclimate.com/github/Pentrick-star/frontend-project-12)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Pentrick-star_frontend-project-122&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Pentrick-star_frontend-project-122)

### Chat Application

React-приложение для обмена сообщений в реальном времени.

### Установка и запуск

```bash
make install
make build
make start
```

Для разработки:
```bash
cd frontend && npm run dev
```

### Локальные серверы

- **Frontend (разработка)**: [http://localhost:5173](http://localhost:5173)
- **Backend сервер**: [http://localhost:5001](http://localhost:5001)

### Запуск серверов

1. **Запуск backend сервера** (в отдельном терминале):
```bash
npx @hexlet/chat-server
```

2. **Запуск frontend сервера** (в отдельном терминале):
```bash
cd frontend && npm run dev
```

### Деплой на Render

1. Подключите репозиторий к Render
2. Создайте новый **Static Site**
3. Укажите:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Добавьте переменную окружения:
   - **NODE_ENV**: `production`

### Исправленные проблемы

- ✅ Авторизация и сохранение токена в localStorage
- ✅ Навигация после успешного логина
- ✅ WebSocket соединение с сервером чата
- ✅ Устранение дублирования сообщений
- ✅ Устойчивость к ошибкам WebSocket
