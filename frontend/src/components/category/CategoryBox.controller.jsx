import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategoryList } from '../../services/api/categoryService';
import { useEffect } from 'react';

export const useCategoryList = (userId) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['categories', userId],
    queryFn: () => getCategoryList(userId),
    enabled: !!userId,
    staleTime: 10 * 1000, // 10 seconds (reduced for more frequent updates)
    cacheTime: 1 * 60 * 1000, // 1 minute (reduced for more frequent updates)
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Listen for settings changes to refresh data
  useEffect(() => {
    const handleSettingsChange = (event) => {
      console.log('useCategoryList received settings change event:', event.detail);
      
      // If it's a data reset or import, invalidate the categories query
      if (event.detail.type === 'dataReset' || event.detail.type === 'dataImported') {
        console.log('Invalidating categories query due to reset/import');
        queryClient.invalidateQueries(['categories', userId]);
        queryClient.invalidateQueries(['categoryList', userId]);
      }
    };

    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, [queryClient, userId]);

  return query;
};
