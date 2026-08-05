import { sendGet, sendPatch, sendPut } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import {
  ChangePasswordRequest,
  MeProfile,
  UpdateProfileRequest,
} from '@/config/interface';

export const MeService = {
  getProfile: async (): Promise<MeProfile> => {
    return await sendGet(`${API_ROOT}/v1/me`);
  },

  updateProfile: async (payload: UpdateProfileRequest): Promise<MeProfile> => {
    return await sendPatch(`${API_ROOT}/v1/me`, payload);
  },

  // BE trả 204 No Content nên không có body để dùng.
  changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
    await sendPut(`${API_ROOT}/v1/me/password`, payload);
  },
};
