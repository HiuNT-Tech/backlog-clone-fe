import { AuthService } from '@/lib/apis/auth';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { LoginUserRequest } from '@/config/interface';
import { toastHelpers } from './use-toast';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    mutateAsync: login,
    isPending: isLoginPending,
    error: loginError,
  } = useMutation({
    mutationFn: async (data: LoginUserRequest) => {
      return await AuthService.loginUser(data);
    },
    onSuccess: () => {
      toastHelpers.success({
        description: t('toast.success.userLoggedIn'),
      });
      router.push('/board');
    },
  });

  const {
    mutateAsync: logout,
    isPending: isLogoutPending,
    error: logoutError,
  } = useMutation({
    mutationFn: async () => {
      return await AuthService.logout();
    },
    onSuccess: () => {
      toastHelpers.success({
        description: t('toast.success.userLoggedOut'),
      });
      router.push('/login');
    },
  });

  const {
    mutateAsync: refreshToken,
    isPending: isRefreshTokenPending,
    error: refreshTokenError,
  } = useMutation({
    mutationFn: async () => {
      return await AuthService.refreshToken();
    },
  });

  return {
    login,
    isLoginPending,
    loginError,

    logout,
    isLogoutPending,
    logoutError,

    refreshToken,
    isRefreshTokenPending,
    refreshTokenError,
  };
};
