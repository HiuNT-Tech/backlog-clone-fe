'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from './layout/sidebar';
import { Header } from './layout/header';

// Create a client instance
const queryClient = new QueryClient();

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </QueryClientProvider>
  );
}
