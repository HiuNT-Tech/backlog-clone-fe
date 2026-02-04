import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/lib/apis/auth';
import { LoginUserRequest, LoginUserResponse } from '@/config/interface';
import { RootState } from '@/redux/store';

// User type from API response
type User = LoginUserResponse['user'];

export interface UserState {
  currentUser: User | null;
}

// Initial state
const initialState: UserState = {
  currentUser: null,
};

// Async thunk for login - returns user object from API
export const loginUserAPI = createAsyncThunk<User, LoginUserRequest>(
  'user/loginUserAPI',
  async (data: LoginUserRequest) => {
    const response = await AuthService.loginUser(data);
    return response.user;
  }
);

// Redux slice for user
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: state => {
      state.currentUser = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      loginUserAPI.fulfilled,
      (state, action: PayloadAction<User>) => {
        // action.payload is the user object from API response
        state.currentUser = action.payload;
      }
    );
  },
});

// Actions export
export const { logoutUser } = userSlice.actions;

// Selector - uses RootState for proper typing with store
export const selectCurrentUser = (state: RootState) => {
  return state.user.currentUser;
};

// Reducer export
export const userReducer = userSlice.reducer;
