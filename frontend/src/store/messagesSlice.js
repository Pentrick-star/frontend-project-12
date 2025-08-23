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
      // Отправляем сообщение через API
      const response = await api.post('/messages', messageData);
      
      // Также отправляем через WebSocket для real-time обновлений
      const socketService = (await import('../services/socket')).default;
      socketService.emit('newMessage', messageData);
      
      return response.data;
    } catch (error) {
      console.error('sendMessage error:', error);
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
      // Проверяем, нет ли уже такого сообщения
      const existingMessage = state.items.find(
        msg => msg.id === action.payload.id || 
        (msg.body === action.payload.body && 
         msg.channelId === action.payload.channelId && 
         msg.username === action.payload.username)
      );
      
      if (!existingMessage) {
        state.items.push(action.payload);
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
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Проверяем, нет ли уже такого сообщения
        const existingMessage = state.items.find(
          msg => msg.id === action.payload.id
        );
        
        if (!existingMessage) {
          state.items.push(action.payload);
        }
      });
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
