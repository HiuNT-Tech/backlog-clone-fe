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
import { registerFormSchema } from '@/validation/register-form-schemas';
import Images from '@/assets';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface RegisterFormData extends RegisterUserRequest {
  passwordConfirmation: string;
}

type FormData = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const getFieldError = (field: keyof FormData): string | undefined => {
    return errors[field]?.message;
  };

  const onSubmit = async (data: RegisterFormData) => {
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

  const onError = (formErrors: typeof errors) => {
    setTimeout(() => {}, 200);
  };

  return (
    <form className="w-full max-w-sm">
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
            error={getFieldError('email')}
            {...register('email', {
              setValueAs: (value: string) => value?.trim() || '',
            })}
            disabled={isSubmitting}
          />

          <Input
            type="password"
            placeholder={t('auth.register.passwordLabel')}
            error={getFieldError('password')}
            {...register('password', {
              setValueAs: (value: string) => value?.trim() || '',
            })}
            disabled={isSubmitting}
          />

          <Input
            type="password"
            placeholder={t('auth.register.confirmPasswordLabel')}
            error={getFieldError('passwordConfirmation')}
            {...register('passwordConfirmation', {
              setValueAs: (value: string) => value?.trim() || '',
            })}
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <Button
          disabled={isSubmitting}
          className="w-full mt-6 bg-theme-main hover:bg-theme-hover text-white interceptor-loading"
          onClick={handleSubmit(onSubmit, onError)}
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
