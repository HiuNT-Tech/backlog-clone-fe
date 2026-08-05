import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { MeService } from '@/lib/apis/me';
import { toastHelpers } from '@/hooks/use-toast';
import { selectCurrentUser, updateUser } from '@/redux/user/userSlice';
import type {
  ChangePasswordRequest,
  MeProfile,
  UpdateProfileRequest,
} from '@/config/interface';

export const ME_QUERY_KEY = ['me', 'profile'] as const;

/**
 * Không khai `onError` ở các mutation bên dưới: interceptor trong
 * `utils/authorizeAxios.ts` đã bắn toast lỗi cho mọi request thất bại, thêm nữa
 * sẽ hiện 2 toast cho cùng một lỗi.
 */
export const useMe = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const {
    data: profile,
    isLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => await MeService.getProfile(),
  });

  const {
    mutateAsync: updateProfile,
    isPending: isUpdateProfilePending,
    error: updateProfileError,
  } = useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      return await MeService.updateProfile(data);
    },
    onSuccess: (updated: MeProfile) => {
      queryClient.setQueryData(ME_QUERY_KEY, updated);
      // Header đọc tên/ảnh từ redux (đã persist), nên phải đồng bộ lại ở đây —
      // giữ nguyên các field khác như token, chỉ ghi đè phần vừa đổi.
      if (currentUser) {
        dispatch(
          updateUser({
            ...currentUser,
            displayName: updated.displayName,
            avatar: updated.avatar,
          })
        );
      }
      toastHelpers.success({
        description: t('toast.success.profileUpdated'),
      });
    },
  });

  const {
    mutateAsync: changePassword,
    isPending: isChangePasswordPending,
    error: changePasswordError,
  } = useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      await MeService.changePassword(data);
    },
    onSuccess: () => {
      toastHelpers.success({
        description: t('toast.success.passwordChanged'),
      });
    },
  });

  return {
    profile,
    isLoading,
    profileError,
    refetchProfile,

    updateProfile,
    isUpdateProfilePending,
    updateProfileError,

    changePassword,
    isChangePasswordPending,
    changePasswordError,
  };
};
