'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/user/userSlice';

const PUBLIC_ROUTES = ['/login', '/register', '/account/verification'];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );
}

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) return;
    if (isPublicRoute(pathname)) return;
    router.push('/login');
  }, [currentUser, pathname, router]);

  if (currentUser) return <>{children}</>;
  if (isPublicRoute(pathname)) return <>{children}</>;
  return null;
}
