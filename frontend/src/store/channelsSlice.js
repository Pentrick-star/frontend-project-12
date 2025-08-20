import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth || {};
      const response = await axios.get('/api/v1/channels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      toast.error('Ошибка загрузки данных');
      return rejectWithValue(error.message);
    }
  }
);

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (channelData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth || {};
      const response = await axios.post('/api/v1/channels', channelData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  async (channelId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth || {};
      await axios.delete(`/api/v1/channels/${channelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  async ({ channelId, name }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth || {};
      const response = await axios.patch(`/api/v1/channels/${channelId}`, { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      .addCase(removeChannel.fulfilled, (state, action) => {
        const removedId = action.payload;
        state.items = state.items.filter(channel => channel.id !== removedId);
        if (state.currentChannelId === removedId) {
          const defaultChannel = state.items.find(channel => channel.name === 'general');
          state.currentChannelId = defaultChannel ? defaultChannel.id : (state.items[0]?.id || null);
        }
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const { id, ...updates } = action.payload;
        const channelIndex = state.items.findIndex(channel => channel.id === id);
        if (channelIndex !== -1) {
          state.items[channelIndex] = { ...state.items[channelIndex], ...updates };
        }
      });
  },
});

export const { setCurrentChannel, addChannel, removeChannelById, updateChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
