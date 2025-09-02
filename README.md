[![hexlet-check](https://github.com/Pentrick-star/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Pentrick-star/frontend-project-12/actions/workflows/hexlet-check.yml)

# Hexlet Chat

Чат-приложение на React с WebSocket для Hexlet.

## 🚀 Запуск

### Backend (сервер)
```bash
npx @hexlet/chat-server
```
- **Backend**: [http://localhost:5001](http://localhost:5001)

### Frontend (разработка)
```bash
cd frontend
npm run dev
```
- **Frontend (разработка)**: [http://localhost:5173](http://localhost:5173)

### Frontend (production)
```bash
make build
make start
```
- **Frontend (production)**: [http://localhost:5001](http://localhost:5001)

## 🧪 Тестирование

```bash
make test
```

## 📁 Структура проекта

- `frontend/` - React приложение
- `__tests__/` - Playwright тесты
- `Makefile` - команды для сборки и тестирования
