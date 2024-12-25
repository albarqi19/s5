import { useState, useEffect } from 'react';
import { fetchFromApi } from '../../lib/api/fetcher';
import type { ApiEndpoint } from '../../lib/api/endpoints';
import { mockStudents, mockRecords, mockTeachers } from '../../data/mockData';

interface UseApiDataOptions {
  useMockData?: boolean;
}

export function useApiData<T>(
  endpoint: ApiEndpoint,
  options: UseApiDataOptions = { useMockData: true }
) {
  const [data, setData] = useState<T[]>(() => {
    if (!options.useMockData) return [];
    
    switch (endpoint) {
      case 'students':
        return mockStudents as T[];
      case 'records':
        return mockRecords as T[];
      case 'teachers':
        return mockTeachers as T[];
      default:
        return [];
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(options.useMockData);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!options.useMockData) {
        try {
          setLoading(true);
          const result = await fetchFromApi<T>(endpoint);
          
          if (mounted) {
            setData(result);
            setIsUsingMockData(false);
            setError(null);
          }
        } catch (err) {
          if (mounted) {
            console.error(`Error loading ${endpoint}:`, err);
            if (options.useMockData) {
              setIsUsingMockData(true);
            } else {
              setError('حدث خطأ في تحميل البيانات');
            }
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [endpoint, options.useMockData]);

  return {
    data,
    loading,
    error,
    isUsingMockData,
    refetch: () => {
      setLoading(true);
      setError(null);
    }
  };
}