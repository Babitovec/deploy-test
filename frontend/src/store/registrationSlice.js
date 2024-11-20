import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios.js';

export const fetchRegistrationData = createAsyncThunk(
  'registration/fetchRegistrationData',
  async (userId, { getState }) => {
    const state = getState();
    const token = selectToken(state); // Получаем токен из состояния

    if (!token) {
      throw new Error('Token is missing');
    }

    const response = await axios.get(`/registrationReward`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    });
    return response.data;
  }
)

const registrationSlice = createSlice({
  name: 'registration',
  initialState: {
    token: null,
    yearsRegistered: null,
    reward: null,
    is_premium: false,
    flames_count: undefined,
    gifts_count: undefined,
    loading: false,
    error: null,
  },
  reducers: {
    getRegistrationData: (state, action) => {
      state.token = action.payload.token
      state.yearsRegistered = action.payload.yearsRegistered;
      state.reward = action.payload.reward;
      state.is_premium = action.payload.is_premium;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrationData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegistrationData.fulfilled, (state, action) => {
        state.loading = false;
        state.yearsRegistered = action.payload.yearsRegistered;
        state.reward = action.payload.reward;
        state.is_premium = action.payload.is_premium;
      })
      .addCase(fetchRegistrationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { getRegistrationData } = registrationSlice.actions;

export const selectToken = (state) => state.registration.token;
export const selectLoadingFetchRegistrationData = (state) => state.registration.loading;
export const selectYearsRegistered = (state) => state.registration.yearsRegistered;
export const selectReward = (state) => state.registration.reward;
export const selectIs_premium = (state) => state.registration.is_premium;
export const selectFlames_count = (state) => state.registration.flames_count;
export const selectGifts_count = (state) => state.registration.gifts_count;


export default registrationSlice.reducer;
