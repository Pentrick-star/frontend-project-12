import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../services/api';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/channels');
      return response.data;
    } catch (error) {
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
      const response = await api.post('/channels', channelData);
      toast.success('Канал создан');
      return response.data;
    } catch (error) {
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
      state.items.push(action.payload);
      if (!state.currentChannelId) {
        state.currentChannelId = action.payload.id;
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
        state.loading = false;
        state.items = action.payload;
        if (state.items.length > 0 && !state.currentChannelId) {
          const generalChannel = state.items.find(channel => channel.name === 'general');
          state.currentChannelId = generalChannel ? generalChannel.id : state.items[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.currentChannelId = action.payload.id;
      })
      .addCase(createChannel.rejected, (state, action) => {
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
