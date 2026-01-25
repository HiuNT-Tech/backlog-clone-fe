import authorizedAxiosInstance from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';

export const AuthService = {
  registerUser: async ({ user }: { user: Record<string, unknown> }) => {
    return (
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, user)
    ).data;
  },

  verifyUser: async ({ user }: { user: Record<string, unknown> }) => {
    return (
      await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, user)
    ).data;
  },
};
