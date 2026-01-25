'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RegisterUserRequest } from '@/config/interface';
import { AuthService } from '@/lib/apis/auth';
import { toastHelpers } from '@/hooks/use-toast';
import { EMAIL_RULE, PASSWORD_RULE } from '@/utils/validators';
import Images from '@/assets';

interface RegisterFormData extends RegisterUserRequest {
  passwordConfirmation: string;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>();

  const submitRegister = async (data: RegisterFormData) => {
    try {
      const { email, password } = data;
      const response = await AuthService.registerUser({
        user: { email, password },
      });

      toastHelpers.success({
        description: t('auth.register.pending'),
      });

      router.push(`/login?registeredEmail=${response.email}`);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitRegister)} className="w-full max-w-sm">
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

        {/* Form Fields */}
        <div className="space-y-4">
          <Input
            type="text"
            placeholder={t('auth.register.emailLabel')}
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
            placeholder={t('auth.register.passwordLabel')}
            error={errors.password?.message}
            {...register('password', {
              required: t('validation.fieldRequired'),
              pattern: {
                value: PASSWORD_RULE,
                message: t('validation.passwordRule'),
              },
            })}
          />

          <Input
            type="password"
            placeholder={t('auth.register.confirmPasswordLabel')}
            error={errors.passwordConfirmation?.message}
            {...register('passwordConfirmation', {
              validate: (value: string) => {
                if (value === watch('password')) return true;
                return t('validation.passwordConfirmation');
              },
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
          {t('auth.register.submitButton')}
        </Button>

        {/* Login Link */}
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">{t('auth.register.hasAccount')}</p>
          <Link
            href="/login"
            className="text-theme-main hover:text-theme-hover font-medium"
          >
            {t('auth.register.loginLink')}
          </Link>
        </div>
      </div>
    </form>
  );
}
