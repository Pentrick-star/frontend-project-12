import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messagesAPI } from '../../services/api';
import { mockMessages } from '../../utils/testData';

// Асинхронные действия
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (channelId, { rejectWithValue }) => {
    try {
      // Сообщения загружаются через WebSocket, поэтому просто возвращаем пустой массив
      // В реальном приложении здесь можно загрузить историю сообщений
      return { channelId, messages: [] };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка загрузки сообщений');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ channelId, message }, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.sendMessage(channelId, message);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка отправки сообщения');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: mockMessages, // Инициализируем с тестовыми данными
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const { channelId, message } = action.payload;
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      // Проверяем, что сообщение еще не добавлено
      const existingMessage = state.messages[channelId].find(msg => msg.id === message.id);
      if (!existingMessage) {
        state.messages[channelId].push(message);
      }
    },
    removeMessage: (state, action) => {
      const { channelId, messageId } = action.payload;
      if (state.messages[channelId]) {
        state.messages[channelId] = state.messages[channelId].filter(
          msg => msg.id !== messageId
        );
      }
    },
    clearMessages: (state, action) => {
      const channelId = action.payload;
      state.messages[channelId] = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { channelId, messages } = action.payload;
        state.messages[channelId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, () => {
        // Сообщение уже добавлено через WebSocket
        // Здесь можно добавить дополнительную логику если нужно
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addMessage, removeMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
