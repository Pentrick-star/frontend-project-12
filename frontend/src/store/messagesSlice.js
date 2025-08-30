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
      console.log('Adding message to state:', action.payload);
      console.log('Current messages in state:', state.items);
      
      const existingMessage = state.items.find(
        msg => msg.id === action.payload.id
      );
      
      console.log('Existing message found:', existingMessage);
      
      if (!existingMessage) {
        // Используем ту же логику извлечения имени пользователя
        let username = 'Unknown';
        if (action.payload.username) {
          username = action.payload.username;
        } else if (action.payload.name) {
          username = action.payload.name;
        } else if (action.payload.login) {
          username = action.payload.login;
        } else if (action.payload.user && action.payload.user.username) {
          username = action.payload.user.username;
        } else if (action.payload.user && action.payload.user.name) {
          username = action.payload.user.name;
        } else if (action.payload.user && action.payload.user.login) {
          username = action.payload.user.login;
        }
        
        const messageWithUsername = {
          ...action.payload,
          username,
        };
        console.log('Adding message with username:', messageWithUsername);
        state.items.push(messageWithUsername);
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
        // Используем ту же логику извлечения имени пользователя для всех сообщений
        state.items = action.payload.map(message => {
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
          }
          
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
