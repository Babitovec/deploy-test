import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getLeaderboard = createAsyncThunk(
    'leaderboard/get',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get('/leaderboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });
            console.log("Leaderboard:", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue("Ошибка при получении данных:", error.response.data);
        }
    }
);

const getLeaderboardSlice = createSlice({
    name: 'getLeaderboard',
    initialState: {
        totalUsers: 0,
        userRank: 0,
        userUsername: undefined,
        userFlamesCount: 0,
        leaderboard: [],
        loading: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLeaderboard.pending, (state) => {

            })
            .addCase(getLeaderboard.fulfilled, (state, action) => {
                state.leaderboard = action.payload.leaderboard;
                state.totalUsers = action.payload.totalUsers;
                state.userRank = action.payload.userRank;
                state.userUsername = action.payload.userUsername;
                state.userFlamesCount = action.payload.userFlamesCount;
                state.loading = false;
            })
            .addCase(getLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const selectLeaderboard = (state) => state.getLeaderboard.leaderboard;
export const selectTotalUsersLeaderboard = (state) => state.getLeaderboard.totalUsers;
export const selectUserRankLeaderboard = (state) => state.getLeaderboard.userRank;
export const selectUserUsernameLeaderboard = (state) => state.getLeaderboard.userUsername;
export const selectUserFlamesCountLeaderboard = (state) => state.getLeaderboard.userFlamesCount;
export const selectLoadingLeaderboard = (state) => state.getLeaderboard.loading;
export const selectErrorLeaderboard = (state) => state.getLeaderboard.error;

export default getLeaderboardSlice.reducer;