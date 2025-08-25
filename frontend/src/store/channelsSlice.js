import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../services/api';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching channels from API');
      const response = await api.get('/channels');
      console.log('Channels API response status:', response.status);
      console.log('Channels API response data:', response.data);
      console.log('Channels API response headers:', response.headers);
      return response.data;
    } catch (error) {
      console.error('FetchChannels error status:', error.response?.status);
      console.error('FetchChannels error data:', error.response?.data);
      console.error('FetchChannels error message:', error.message);
      if (error.response?.status !== 401) {
        toast.error('Ошибка загрузки данных');
      }
      return rejectWithValue(error.message);
    }
  }
);

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (channelData, { rejectWithValue }) => {
    try {
      console.log('Creating channel with data:', channelData);
      const response = await api.post('/channels', channelData);
      console.log('Channel creation response:', response.data);
      toast.success('Канал создан');
      return response.data;
    } catch (error) {
      console.error('Channel creation error:', error.response?.status, error.response?.data);
      toast.error('Ошибка создания канала');
      return rejectWithValue(error.message);
    }
  }
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (channelId, { rejectWithValue }) => {
    try {
      await api.delete(`/channels/${channelId}`);
      toast.success('Канал удалён');
      return channelId;
    } catch (error) {
      toast.error('Ошибка удаления канала');
      return rejectWithValue(error.message);
    }
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ channelId, name }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/channels/${channelId}`, { name });
      toast.success('Канал переименован');
      return response.data;
    } catch (error) {
      toast.error('Ошибка переименования канала');
      return rejectWithValue(error.message);
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      console.log('Adding channel to state:', action.payload);
      // Проверяем, нет ли уже такого канала
      const existingChannel = state.items.find(ch => ch.id === action.payload.id);
      if (!existingChannel) {
        state.items.push(action.payload);
        if (!state.currentChannelId) {
          state.currentChannelId = action.payload.id;
          console.log('Set currentChannelId to:', action.payload.id);
        }
        console.log('Updated channels state:', state.items);
      } else {
        console.log('Channel already exists in state, skipping add:', action.payload.id);
      }
    },
    removeChannelById: (state, action) => {
      const removedId = action.payload;
      state.items = state.items.filter(channel => channel.id !== removedId);
      if (state.currentChannelId === removedId) {
        const defaultChannel = state.items.find(channel => channel.name === 'general');
        state.currentChannelId = defaultChannel ? defaultChannel.id : (state.items[0]?.id || null);
      }
    },
    updateChannel: (state, action) => {
      const { id, ...updates } = action.payload;
      const channelIndex = state.items.findIndex(channel => channel.id === id);
      if (channelIndex !== -1) {
        state.items[channelIndex] = { ...state.items[channelIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        console.log('FetchChannels fulfilled, received channels:', action.payload);
        state.loading = false;
        state.items = action.payload;
        console.log('Updated channels state:', state.items);
        console.log('Current currentChannelId before update:', state.currentChannelId);
        if (state.items.length > 0 && !state.currentChannelId) {
          const generalChannel = state.items.find(channel => channel.name === 'general');
          state.currentChannelId = generalChannel ? generalChannel.id : state.items[0].id;
          console.log('Set currentChannelId to:', state.currentChannelId);
        }
        console.log('Final currentChannelId:', state.currentChannelId);
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        console.log('Channel creation fulfilled, adding to state:', action.payload);
        // Проверяем, нет ли уже такого канала
        const existingChannel = state.items.find(ch => ch.id === action.payload.id);
        if (!existingChannel) {
          state.items.push(action.payload);
          state.currentChannelId = action.payload.id;
          console.log('Updated channels state:', state.items);
        } else {
          console.log('Channel already exists in state, just setting currentChannelId:', action.payload.id);
          state.currentChannelId = action.payload.id;
        }
      })
      .addCase(createChannel.rejected, (state, action) => {
        console.error('Channel creation rejected:', action.error);
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        const removedId = action.payload;
        state.items = state.items.filter(channel => channel.id !== removedId);
        if (state.currentChannelId === removedId) {
          const defaultChannel = state.items.find(channel => channel.name === 'general');
          state.currentChannelId = defaultChannel ? defaultChannel.id : (state.items[0]?.id || null);
        }
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const { id, ...updates } = action.payload;
        const channelIndex = state.items.findIndex(channel => channel.id === id);
        if (channelIndex !== -1) {
          state.items[channelIndex] = { ...state.items[channelIndex], ...updates };
        }
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentChannel, addChannel, removeChannelById, updateChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
