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
npm install
cd frontend && npm install
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
