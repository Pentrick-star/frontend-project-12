import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching user data...');
      const response = await api.get('/auth/me');
      console.log('User data received:', response.data);
      console.log('User data type:', typeof response.data);
      console.log('User data keys:', Object.keys(response.data || {}));
      // Убеждаемся, что возвращаем правильную структуру данных
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    user: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        console.log('User data saved to Redux:', action.payload);
        state.user = action.payload;
      });
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
