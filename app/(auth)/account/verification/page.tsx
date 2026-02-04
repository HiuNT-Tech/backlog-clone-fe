'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AuthService } from '@/lib/apis/auth';
import { toastHelpers } from '@/hooks/use-toast';

function VerifyContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyAccount = async () => {
      if (email && token) {
        try {
          await AuthService.verifyUser({ user: { email, token } });
          setVerified(true);
          toastHelpers.success({
            description: t('toast.success.userVerified'),
          });
        } catch (error) {
          toastHelpers.error({
            description: t('toast.error.userVerificationFailed'),
          });
          router.push('/404');
        }
      }
    };

    verifyAccount();
  }, [email, token, router, t]);

  // Redirect to login after verification
  useEffect(() => {
    if (verified && email) {
      router.push(`/login?verifiedEmail=${email}`);
    }
  }, [verified, email, router]);

  // Loading state
  if (!verified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p className="text-white text-lg">{t('auth.verification.loading')}</p>
      </div>
    );
  }

  return null;
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
