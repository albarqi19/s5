import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api/client';
import { API_CONFIG } from '../../config/api';
import { mockStudents, mockRecords, mockTeachers } from '../../data/mockData';

type Endpoint = keyof typeof API_CONFIG.endpoints;

interface UseDataOptions {
  fallbackToMock?: boolean;
}

export function useData<T>(
  endpoint: Endpoint, 
  options: UseDataOptions = { fallbackToMock: true }
) {
  const [data, setData] = useState<T[]>(() => {
    if (!options.fallbackToMock) return [];
    
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
  const [isUsingMockData, setIsUsingMockData] = useState(options.fallbackToMock);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await apiClient<T>(endpoint);
        
        if (mounted) {
          setData(result);
          setIsUsingMockData(false);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error(`Error fetching ${endpoint}:`, err);
          if (options.fallbackToMock) {
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

    fetchData();

    return () => {
      mounted = false;
    };
  }, [endpoint, options.fallbackToMock]);

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