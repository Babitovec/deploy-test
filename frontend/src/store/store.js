import { configureStore } from '@reduxjs/toolkit';
import checkLoginReducer from './checkLoginSlice';
import registrationReducer from './registrationSlice';
import tasksReducer from './tasksSlice'
import getReferralsReducer from './referralsSlice'
import getLeaderboardReducer  from './leaderboardSlice';
import getUserDataReducer from './userDataSlice';
import walletReducer from './walletSlice';

const store = configureStore({
  reducer: {
    checkLogin: checkLoginReducer,
    registration: registrationReducer,
    getTasks: tasksReducer,
    getReferrals: getReferralsReducer,
    getLeaderboard: getLeaderboardReducer,
    getUserData: getUserDataReducer,
    wallet: walletReducer,
  },
});

export default store;
