import { useState, useEffect } from 'react';
import { serverApi } from '../../lib/api/server';
import { SERVER_CONFIG } from '../../config/server';
import { mockStudents, mockRecords, mockTeachers } from '../../data/mockData';

export function useServerData<T>(endpoint: keyof typeof SERVER_CONFIG.endpoints) {
  const [data, setData] = useState<T[]>(() => {
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
  const [isUsingMockData, setIsUsingMockData] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await serverApi.fetch<T>(endpoint);
        
        if (mounted) {
          setData(result);
          setIsUsingMockData(false);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error(`Error fetching ${endpoint}:`, err);
          // في حالة الخطأ، نستخدم البيانات التجريبية
          setIsUsingMockData(true);
          setError('حدث خطأ في تحميل البيانات. جاري عرض بيانات تجريبية.');
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
  }, [endpoint]);

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