import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/lib/apis/auth';
import { LoginUserRequest, LoginUserResponse } from '@/config/interface';
import { RootState } from '@/redux/store';

// User type from API response
type User = LoginUserResponse['user'];

// 1. Define State Interface
export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// 2. Initial State
const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

// 3. Async Thunks
// Naming convention: user/[actionName]
export const loginUserAPI = createAsyncThunk<User, LoginUserRequest>(
  'user/login',
  async (data: LoginUserRequest) => {
    const response = await AuthService.loginUser(data);
    return response.user;
  }
);

// 4. Create Slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Synchronous reducers
    updateUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    resetUser: state => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Handle Async Thunk Lifecycle
      .addCase(loginUserAPI.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      });
  },
});

// 5. Exports
// Actions
export const { updateUser, resetUser } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// Reducer
export const userReducer = userSlice.reducer;
