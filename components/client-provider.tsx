'use client';

import { Sidebar } from './layout/sidebar';
import { Header } from './layout/header';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </>
  );
}
