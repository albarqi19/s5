import { useState, useEffect } from 'react';
import { fetchData } from '../lib/api';
import { API_CONFIG } from '../config/api';
import { mockStudents, mockRecords, mockTeachers } from '../data/mockData';

export function useData<T>(endpoint: keyof typeof API_CONFIG.endpoints) {
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

    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchData<T>(endpoint);
        
        if (mounted) {
          setData(result);
          setIsUsingMockData(false);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error(`Error loading data for ${endpoint}:`, err);
          setIsUsingMockData(true);
          setError('جاري عرض البيانات التجريبية بسبب خطأ في الاتصال');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

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