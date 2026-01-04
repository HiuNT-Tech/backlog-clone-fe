import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from '@/redux/activeBoard/activeBoardSlice';

const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
