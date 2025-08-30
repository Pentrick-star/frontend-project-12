import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../services/api';

// Функция для извлечения имени пользователя из сообщения
const extractUsername = (message, currentUser = null) => {
  let username = 'Unknown';
  if (message.username) {
    username = message.username;
  } else if (message.name) {
    username = message.name;
  } else if (message.login) {
    username = message.login;
  } else if (message.user && message.user.username) {
    username = message.user.username;
  } else if (message.user && message.user.name) {
    username = message.user.name;
  } else if (message.user && message.user.login) {
    username = message.user.login;
  } else if (currentUser && currentUser.username) {
    username = currentUser.username;
  } else if (currentUser && currentUser.name) {
    username = currentUser.name;
  } else if (currentUser && currentUser.login) {
    username = currentUser.login;
  }
  return username;
};

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
      console.log('=== REDUX ADD MESSAGE DEBUG ===');
      console.log('Adding message to state:', action.payload);
      console.log('Current messages in state:', state.items);
      console.log('Message ID:', action.payload.id);
      console.log('Message body:', action.payload.body);
      console.log('Message channelId:', action.payload.channelId);
      console.log('Message username:', action.payload.username);
      
      const existingMessage = state.items.find(
        msg => msg.id === action.payload.id
      );
      
      console.log('Existing message found:', existingMessage);
      
      if (!existingMessage) {
        // Используем функцию для извлечения имени пользователя
        const username = extractUsername(action.payload);
        
        const messageWithUsername = {
          ...action.payload,
          username,
        };
        console.log('Adding message with username:', messageWithUsername);
        state.items.push(messageWithUsername);
        console.log('Message added successfully. Total messages:', state.items.length);
      } else {
        console.log('Message not added - duplicate detected');
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
        // Используем функцию для извлечения имени пользователя для всех сообщений
        state.items = action.payload.map(message => {
          const username = extractUsername(message);
          return {
            ...message,
            username,
          };
        });
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
