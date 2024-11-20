import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const checkLoginStatus = createAsyncThunk(
  'checkLogin/status',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('/login-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data; // возвращаем данные из ответа
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const checkLoginSlice = createSlice({
  name: 'checkLogin',
  initialState: {
    loading: false,
    bonusReceivedToday: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkLoginStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.bonusReceivedToday = action.payload.bonusReceivedToday;
      })
      .addCase(checkLoginStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectBonusReceivedToday = (state) => state.checkLogin.bonusReceivedToday;
export const selectLoadingCheckLogin = (state) => state.checkLogin.loading;

export default checkLoginSlice.reducer;
