import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../services/api';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching messages from API');
      const response = await api.get('/messages');
      console.log('Messages API response status:', response.status);
      console.log('Messages API response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('FetchMessages error status:', error.response?.status);
      console.error('FetchMessages error data:', error.response?.data);
      console.error('FetchMessages error message:', error.message);
      toast.error('Ошибка загрузки данных');
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      console.log('Sending message via API:', messageData);
      // Отправляем сообщение только через API
      const response = await api.post('/messages', messageData);
      console.log('Message sent successfully:', response.data);
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
      console.log('Adding message to state:', action.payload);
      
      // Проверяем, нет ли уже такого сообщения
      const existingMessage = state.items.find(
        msg => msg.id === action.payload.id
      );
      
      if (!existingMessage) {
        state.items.push(action.payload);
        console.log('Message added to state, total messages:', state.items.length);
      } else {
        console.log('Message already exists in state, skipping add:', action.payload.id);
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
        console.log('Message sent fulfilled, adding to state:', action.payload);
        console.log('Current messages count before add:', state.items.length);
        console.log('Existing message IDs before add:', state.items.map(msg => msg.id));
        
        // Проверяем, нет ли уже такого сообщения
        const existingMessage = state.items.find(
          msg => msg.id === action.payload.id
        );
        
        if (!existingMessage) {
          state.items.push(action.payload);
          console.log('Message added to state from sendMessage.fulfilled');
          console.log('Total messages after add:', state.items.length);
        } else {
          console.log('Message already exists in state, skipping add from sendMessage.fulfilled');
          console.log('Existing message:', existingMessage);
        }
      });
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
