import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../services/api';

const extractUsername = (message, currentUser = null) => {
  let username = null;
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
      const existingMessage = state.items.find(
        msg => msg.id === action.payload.id
      );
      
      if (!existingMessage) {
        const username = extractUsername(action.payload);
        
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
          const username = extractUsername(message);
          if (!username) {
            console.error('Message from server without username:', message);
            return null;
          }
          return {
            ...message,
            username,
          };
        }).filter(Boolean); // Убираем null значения
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
