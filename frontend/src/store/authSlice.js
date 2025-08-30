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
        console.log('User data type:', typeof action.payload);
        console.log('User data keys:', Object.keys(action.payload || {}));
        
        // Убеждаемся, что данные пользователя сохраняются правильно
        // Обрабатываем разные возможные форматы данных
        const userData = action.payload;
        if (typeof userData === 'object' && userData !== null) {
          // Если данные приходят как объект, сохраняем как есть
          state.user = userData;
        } else if (typeof userData === 'string') {
          // Если данные приходят как строка, возможно это JSON
          try {
            state.user = JSON.parse(userData);
          } catch (e) {
            // Если не JSON, создаем объект с username
            state.user = { username: userData };
          }
        } else {
          // Fallback
          state.user = { username: 'Unknown' };
        }
        console.log('State user after save:', state.user);
      });
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
