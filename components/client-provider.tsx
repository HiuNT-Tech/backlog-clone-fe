'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from '@/redux/store';

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
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <div className="flex">
            <Sidebar />
            {children}
          </div>
        </QueryClientProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
