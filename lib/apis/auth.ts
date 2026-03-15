import { sendPost, sendDelete, sendGet } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import {
  LoginUserRequest,
  LoginUserResponse,
  RefreshTokenResponse,
} from '@/config/interface';

export const AuthService = {
  registerUser: async ({ user }: { user: Record<string, unknown> }) => {
    return await sendPost(`${API_ROOT}/v1/users/register`, user);
  },

  verifyUser: async ({ user }: { user: Record<string, unknown> }) => {
    return await sendPost(`${API_ROOT}/v1/users/verify-account`, user);
  },

  loginUser: async (user: LoginUserRequest): Promise<LoginUserResponse> => {
    return await sendPost(`${API_ROOT}/v1/users/login`, user);
  },

  logout: async (): Promise<void> => {
    await sendDelete(`${API_ROOT}/v1/users/logout`);
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    return await sendGet(`${API_ROOT}/v1/users/refresh_token`);
  },
};
