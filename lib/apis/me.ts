import {
  sendGet,
  sendPatch,
  sendPostFormData,
  sendPut,
} from '@/utils/authorizeAxios';
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

  updateProfile: async (data: UpdateProfileRequest): Promise<MeProfile> => {
    return await sendPatch(`${API_ROOT}/v1/me`, data);
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await sendPut(`${API_ROOT}/v1/me/password`, data);
  },

  uploadAvatar: async (file: File): Promise<MeProfile> => {
    const formData = new FormData();
    formData.append('avatar', file, file.name);
    return await sendPostFormData(`${API_ROOT}/v1/me/avatar`, formData);
  },
};
