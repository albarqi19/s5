import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_CONFIG } from '../config/server';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// كائن عام لتخزين البيانات المؤقتة بين مختلف مكونات التطبيق
const globalCache: Record<string, CacheItem<any>> = {};

// مدة صلاحية البيانات المخزنة مؤقتًا (بالمللي ثانية)
const CACHE_TTL = 60 * 1000; // دقيقة واحدة

interface UseCachedDataOptions {
  ttl?: number;        // مدة صلاحية البيانات المخزنة مؤقتًا (بالمللي ثانية)
  autoRefresh?: boolean; // هل يتم تحديث البيانات تلقائيًا بعد انتهاء صلاحيتها
  forceRefresh?: boolean; // تجاهل التخزين المؤقت وإجبار إعادة تحميل البيانات
}

export function useCachedData<T>(
  endpoint: string,
  options: UseCachedDataOptions = {}
) {
  const { ttl = CACHE_TTL, autoRefresh = true, forceRefresh = false } = options;
  
  // تعديل: البدء بمصفوفة فارغة [] بدلاً من null لتجنب أخطاء null.length
  const [data, setData] = useState<T | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // تحميل البيانات من الـ API
  const fetchData = async (skipCache = false) => {
    const cacheKey = `api:${endpoint}`;
    const now = Date.now();
    
    // تحقق من وجود بيانات في التخزين المؤقت وصلاحيتها
    if (!skipCache && !forceRefresh && globalCache[cacheKey] && (now - globalCache[cacheKey].timestamp) < ttl) {
      setData(globalCache[cacheKey].data);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_CONFIG.baseUrl}/api/${endpoint}`);
      
      // حفظ البيانات في التخزين المؤقت
      globalCache[cacheKey] = {
        data: response.data || [], // تأكد من أن البيانات ليست null
        timestamp: now,
      };
      
      setData(response.data || []); // تأكد من أن البيانات ليست null
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(`فشل في تحميل البيانات من ${endpoint}`);
      // تعيين مصفوفة فارغة في حالة الخطأ
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  
  // تحميل البيانات مرة واحدة عند تحميل المكون
  useEffect(() => {
    fetchData();
    
    // إذا كان التحديث التلقائي مفعّلاً، قم بتحديث البيانات بانتظام
    let intervalId: NodeJS.Timeout | null = null;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchData();
      }, ttl);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [endpoint, ttl, autoRefresh, forceRefresh]); // تحديث البيانات عند تغيير المعلمات
  
  // تحديث البيانات يدوياً
  const refresh = () => fetchData(true);
  
  // مسح البيانات المخزنة مؤقتاً
  const clearCache = () => {
    const cacheKey = `api:${endpoint}`;
    if (globalCache[cacheKey]) {
      delete globalCache[cacheKey];
    }
  };
  
  return { data, loading, error, refresh, clearCache };
}