import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { ApiEndpoint } from '../../config/api';
import { SERVER_CONFIG } from '../../config/server';

// تكوين Axios لاستخدام عنوان URL الأساسي
const api = axios.create({
  baseURL: SERVER_CONFIG.baseUrl
});

export function useApi<T>(endpoint: ApiEndpoint) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      console.log(`Fetching from ${SERVER_CONFIG.baseUrl}/api/${endpoint}`);
      setLoading(true);
      
      // First test the server connection
      const testResponse = await api.get(`/test`);
      console.log('Server test response:', testResponse.data);
      
      // Then fetch the actual data
      const response = await api.get<T[]>(`/api/${endpoint}`);
      console.log('Data response:', response.data);
      
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}