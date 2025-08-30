import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../services/api';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/messages');
      return response.data;
    } catch (error) {
      toast.error('Ошибка загрузки данных');
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      toast.error('Ошибка отправки сообщения');
      return rejectWithValue(error.message);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const existingMessage = state.items.find(
        msg => msg.id === action.payload.id
      );
      
      if (!existingMessage) {
        // Убеждаемся, что у сообщения есть правильное имя пользователя
        const messageWithUsername = {
          ...action.payload,
          username: action.payload.username || 'Unknown',
        };
        state.items.push(messageWithUsername);
      }
    },
    clearMessages: (state) => {
      state.items = [];
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
        // Убеждаемся, что у всех сообщений есть правильные имена пользователей
        state.items = action.payload.map(message => ({
          ...message,
          username: message.username || 'Unknown',
        }));
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Не добавляем сообщение здесь, так как оно будет добавлено через addMessage
        // с правильным именем пользователя
      });
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
