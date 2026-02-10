import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/lib/apis/auth';
import { LoginUserRequest, LoginUserResponse } from '@/config/interface';
import { RootState } from '@/redux/store';

// User type from API response
// type User = LoginUserResponse['user'];
type User = LoginUserResponse;

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

// 3. Async Thunks (chuẩn hóa theo pattern createAsyncThunk)
// Login
export const loginUserAPI = createAsyncThunk<User, LoginUserRequest>(
  'user/loginUserAPI',
  async (data: LoginUserRequest) => {
    const response = await AuthService.loginUser(data);
    return response;
  }
);

// Logout (clear cookie + clear Redux user state)
export const logoutUserAPI = createAsyncThunk<void, void>(
  'user/logoutUserAPI',
  async () => {
    await AuthService.logout();
  }
);

// 4. Create Slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Synchronous reducers (giống updateUser / resetUser ở dự án cũ)
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
      // Login lifecycle
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
      })
      // Logout lifecycle
      .addCase(logoutUserAPI.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserAPI.fulfilled, state => {
        state.loading = false;
        state.currentUser = null;
      })
      .addCase(logoutUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to logout';
      });
  },
});

// 5. Exports
// Actions
export const { updateUser, resetUser } = userSlice.actions;

// Selectors (chuẩn hóa giống dự án cũ, nhưng có thêm loading/error)
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.user.currentUser);

// Reducer
export const userReducer = userSlice.reducer;
