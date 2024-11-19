import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wasSent: false, // начальное состояние
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWasSent(state, action) {
      state.wasSent = action.payload;
    },
  },
});

export const { setWasSent } = walletSlice.actions;

// Экспортируем селектор для получения значения wasSent
export const selectWasSent = (state) => state.wallet.wasSent;

export default walletSlice.reducer;

