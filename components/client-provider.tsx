'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client instance
const queryClient = new QueryClient();

interface ClientProvidersProps {
  children: React.ReactNode;
  withLayout?: boolean;
}

// Lazy import layout components
import { Sidebar } from './layout/sidebar';
import { Header } from './layout/header';

export default function ClientProviders({
  children,
  withLayout = true,
}: ClientProvidersProps) {
  if (withLayout) {
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

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
