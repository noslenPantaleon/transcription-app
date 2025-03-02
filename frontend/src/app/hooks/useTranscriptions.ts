'use client';
import { useQuery } from '@tanstack/react-query';

import { getTranscriptions } from '../services/getTranscriptions';

export const useTranscriptions = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['transcriptions'],
    queryFn: getTranscriptions,
    
  });

  return { data, error, isLoading, refetch };
};
