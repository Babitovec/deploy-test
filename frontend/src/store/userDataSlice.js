import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getUserData = createAsyncThunk(
    'userData/get',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get('/get-user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const getUserDataSlice = createSlice({
    name: 'getUserData',
    initialState: {
        flamesCount: undefined,
        giftsCount: undefined,
        loading: true,
        error: null,
    },
    reducers: {
        updateFromGifts: (state, action) => {
            state.flamesCount = action.payload.updatedFlamesCount;
            state.giftsCount = action.payload.updatedGiftsCount;
            state.loading = action.payload.updatedLoading;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserData.pending, (state) => {
                state.error = null; // Сбрасываем ошибку при новом запросе
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.flamesCount = action.payload.flamesCount;
                state.giftsCount = action.payload.giftsCount;
                state.loading = false;
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { updateFromGifts } = getUserDataSlice.actions;

export const selectFlamesCount = (state) => state.getUserData.flamesCount;
export const selectGiftsCount = (state) => state.getUserData.giftsCount;
export const selectLoadingUserdata = (state) => state.getUserData.loading;
export const selectErrorUserdata = (state) => state.getUserData.error;

export default getUserDataSlice.reducer;