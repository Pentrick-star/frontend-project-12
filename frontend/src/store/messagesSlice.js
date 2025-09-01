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
        msg => msg.id === action.payload.id ||
              (msg.body === action.payload.body &&
               msg.channelId === action.payload.channelId &&
               msg.username === action.payload.username)
      );
      
      if (!existingMessage) {
        const username = action.payload.username || action.payload.name || action.payload.login;
        
        if (!username) {
          console.error('Cannot add message without username:', action.payload);
          return;
        }
        
        const messageWithUsername = {
          ...action.payload,
          username,
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
        state.items = action.payload.map(message => {
          const username = message.username || message.name || message.login;
          if (!username) {
            console.error('Message from server without username:', message);
            return null;
          }
          return {
            ...message,
            username,
          };
        }).filter(Boolean);
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Не добавляем сообщение здесь, так как используем WebSocket
      });
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
