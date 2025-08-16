import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isConnected: true, // По умолчанию показываем как подключенное для демо режима
    connectionError: null,
    showModal: false,
    modalType: null, // 'addChannel', 'renameChannel', 'removeChannel'
    modalData: null,
  },
  reducers: {
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
      state.isConnected = false;
    },
    showModal: (state, action) => {
      state.showModal = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    hideModal: (state) => {
      state.showModal = false;
      state.modalType = null;
      state.modalData = null;
    },
  },
});

export const { 
  setConnectionStatus, 
  setConnectionError, 
  showModal, 
  hideModal 
} = uiSlice.actions;

export default uiSlice.reducer;
