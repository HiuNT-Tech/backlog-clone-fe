import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from '@/redux/activeBoard/activeBoardSlice';
import { userReducer } from '@/redux/user/userSlice';

const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
