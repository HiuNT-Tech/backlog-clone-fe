'use client';

import ClientProviders from '@/components/client-provider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientProviders withLayout={true}>{children}</ClientProviders>;
}
