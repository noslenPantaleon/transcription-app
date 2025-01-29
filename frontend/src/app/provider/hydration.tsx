import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { getInverters } from '../services/getInverters';
import React from 'react';
export default async function Hydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // this sets the cache time to 5 minutes
      },
    },
  });
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['inverter', 'inverters'],
      queryFn: () => getInverters,
    }),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
