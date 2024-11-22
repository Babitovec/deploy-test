import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getTasks = createAsyncThunk(
  'tasks/get',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('/tasks', {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      return response.data; // Возвращаем данные, чтобы использовать в `extraReducers`
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const getTasksSlice = createSlice({
  name: 'getTasks',
  initialState: {
    tasks: [], // Добавлено свойство для хранения задач
    status_emoji_in_name: false,
    status_invite_5_friends: false,
    status_connect_wallet: false,
    status_sub_flame_tg: false,
    status_sub_flame_x: false,
    status_share_on_x: false,
    loading: true,
    error: null,
  },
  reducers: {
    // Добавляем экшен для обновления статуса задачи
    updateTaskStatus: (state, action) => {
      const { taskName, status } = action.payload;
      const task = state.tasks.find(task => task.name === taskName);

      if (task) {
        task.completed = status;
      }

      // Можете обновить только если задача найдена
      switch (taskName) {
        case 'emoji_in_name':
          state.status_emoji_in_name = status;
          break;
        case 'invite_5_friends':
          state.status_invite_5_friends = status;
          break;
        case 'connect_wallet':
          state.status_connect_wallet = status;
          break;
        case 'sub_flame_tg':
          state.status_sub_flame_tg = status;
          break;
        case 'sub_flame_x':
          state.status_sub_flame_x = status;
          break;
        case 'share_on_x':
          state.status_share_on_x = status;
          break;
        default:
          break;
      }
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.error = null; // Сбрасываем ошибку при новом запросе
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // Сохраняем задачи в состоянии
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateTaskStatus } = getTasksSlice.actions;

export const selectTasks = (state) => state.getTasks.tasks;
export const selectLoadingGetTasks = (state) => state.getTasks.loading;
export const selectErrorGetTasks = (state) => state.getTasks.error;

export default getTasksSlice.reducer;
