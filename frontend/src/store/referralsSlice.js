import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getReferrals = createAsyncThunk(
    'referrals/get',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get('/referrals', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("Referrals:", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue("Ошибка при получении данных:", error.response.data);
        }
    }
);

const getReferralsSlice = createSlice({
    name: 'getReferrals',
    initialState: {
        loading: true,
        referrals: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReferrals.pending, (state) => {
                state.error = null; // Сбрасываем ошибку при новом запросе
            })
            .addCase(getReferrals.fulfilled, (state, action) => {
                state.loading = false;
                state.referrals = action.payload;
            })
            .addCase(getReferrals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const selectReferrals = (state) => state.getReferrals.referrals;
export const selectLoadingReferrals = (state) => state.getReferrals.loading;
export const selectErrorReferrals = (state) => state.getReferrals.error;

export default getReferralsSlice.reducer;