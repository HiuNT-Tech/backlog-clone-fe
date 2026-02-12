'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginUserRequest } from '@/config/interface';
import { useRouter } from 'next/navigation';
import { EMAIL_RULE, PASSWORD_RULE } from '@/utils/validators';
import { toastHelpers } from '@/hooks/use-toast';
import Images from '@/assets';
import { useAppDispatch } from '@/redux/hooks';
import { loginUserAPI } from '@/redux/user/userSlice';

function LoginForm() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const registeredEmail = searchParams.get('registeredEmail');
  const verifiedEmail = searchParams.get('verifiedEmail');

  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserRequest>();

  const submitLogin = async (data: LoginUserRequest) => {
    try {
      await dispatch(loginUserAPI(data)).unwrap();

      toastHelpers.success({
        description: t('toast.success.userLoggedIn'),
      });

      router.push('/board');
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(submitLogin)} className="w-full max-w-sm">
      <div className="mt-24 mx-4 p-6 bg-white rounded-lg shadow-xl animate-in fade-in zoom-in duration-300">
        {/* Header Icons */}
        <div className="flex justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-theme-main flex items-center justify-center">
            <Image
              src={Images.IconLock}
              alt="Lock"
              width={20}
              height={20}
              className="text-white"
            />
          </div>
          <div className="w-10 h-10 rounded-full bg-theme-main flex items-center justify-center">
            <Image
              src={Images.IconTrello}
              alt="Trello"
              width={20}
              height={20}
              className="text-white"
            />
          </div>
        </div>

        {/* Author */}
        <div className="text-center text-gray-500 text-sm mb-4">
          {t('auth.author')}
        </div>

        {/* Alerts */}
        {verifiedEmail && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
            {t('auth.login.verifiedEmail', { email: verifiedEmail })}
          </div>
        )}

        {registeredEmail && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
            {t('auth.login.registeredEmail', { email: registeredEmail })}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <Input
            type="text"
            placeholder={t('auth.login.emailLabel')}
            error={errors.email?.message}
            {...register('email', {
              required: t('validation.fieldRequired'),
              pattern: {
                value: EMAIL_RULE,
                message: t('validation.emailInvalid'),
              },
            })}
          />

          <Input
            type="password"
            placeholder={t('auth.login.passwordLabel')}
            error={errors.password?.message}
            {...register('password', {
              required: t('validation.fieldRequired'),
              pattern: {
                value: PASSWORD_RULE,
                message: t('validation.passwordRule'),
              },
            })}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-theme-main hover:bg-theme-hover text-white interceptor-loading"
        >
          {t('auth.login.submitButton')}
        </Button>

        {/* Register Link */}
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">{t('auth.login.noAccount')}</p>
          <Link
            href="/register"
            className="text-theme-main hover:text-theme-hover font-medium"
          >
            {t('auth.login.createAccount')}
          </Link>
        </div>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mt-24 mx-4 p-6 bg-white rounded-lg shadow-xl animate-pulse">
          <div className="h-10 w-10 mx-auto rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
