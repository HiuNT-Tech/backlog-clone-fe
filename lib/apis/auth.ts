import authorizedAxiosInstance from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import { LoginUserRequest, LoginUserResponse } from '@/config/interface';

export const AuthService = {
  registerUser: async ({ user }: { user: Record<string, unknown> }) => {
    return (
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, user)
    ).data;
  },

  verifyUser: async ({ user }: { user: Record<string, unknown> }) => {
    return (
      await authorizedAxiosInstance.post(
        `${API_ROOT}/v1/users/verify-account`,
        user
      )
    ).data;
  },

  loginUser: async (user: LoginUserRequest): Promise<LoginUserResponse> => {
    return (
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, user)
    ).data;
  },

  checkAuth: async (): Promise<{
    authenticated: boolean;
    user?: LoginUserResponse['user'];
  }> => {
    try {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/v1/users/me`
      );
      return { authenticated: true, user: response.data };
    } catch (error) {
      return { authenticated: false };
    }
  },

  logout: async (): Promise<void> => {
    await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/logout`);
  },
};
