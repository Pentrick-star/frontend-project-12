# Frontend Project 12

Чат-приложение на React с серверной частью.

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Сборка фронтенда
make build

# Запуск сервера
make start

# Запуск в режиме разработки
cd frontend && npm run dev
```

## Тестирование

Для тестирования авторизации используйте:
- **Username:** admin
- **Password:** admin

## Маршруты

- `/` - Главная страница с чатом (требует авторизации)
- `/login` - Страница входа
- `/*` - Страница 404 для несуществующих маршрутов

## Технологии

- React + Vite
- React Router для маршрутизации
- Formik + Yup для валидации форм
- React Bootstrap для UI компонентов
- Axios для HTTP запросов
- @hexlet/chat-server
- Проксирование API запросов
- JWT авторизация

### Hexlet tests and linter status:
[![Actions Status](https://github.com/Pentrick-star/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Pentrick-star/frontend-project-12/actions)