import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { channelsAPI } from '../../services/api';
import { mockChannels } from '../../utils/testData';

// Асинхронные действия
export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await channelsAPI.getChannels();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка загрузки каналов');
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [], // Начинаем с пустого массива
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(channel => channel.id !== action.payload);
      if (state.currentChannelId === action.payload) {
        state.currentChannelId = state.channels[0]?.id || null;
      }
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload;
      const channel = state.channels.find(ch => ch.id === id);
      if (channel) {
        channel.name = name;
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
        state.channels = action.payload;
        // Устанавливаем первый канал как текущий, если текущий не установлен
        if (!state.currentChannelId && action.payload.length > 0) {
          state.currentChannelId = action.payload[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentChannel, addChannel, removeChannel, renameChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
