import { useState, useEffect } from 'react';
import { fetchSheetData, type SheetRange } from '../../lib/sheets/api';
import { formatStudents, formatRecords, formatTeachers } from '../../utils/formatters';
import { mockStudents, mockRecords, mockTeachers } from '../../data/mockData';
import type { Student, Teacher } from '../../types/student';
import type { Record } from '../../types/record';

type DataType = Student | Record | Teacher;
type FormatterType<T> = (rows: any[]) => T[];

export function useSheetData<T extends DataType>(range: SheetRange) {
  const [data, setData] = useState<T[]>(() => {
    switch (range) {
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

  const getFormatter = (): FormatterType<T> => {
    switch (range) {
      case 'students':
        return formatStudents as FormatterType<T>;
      case 'records':
        return formatRecords as FormatterType<T>;
      case 'teachers':
        return formatTeachers as FormatterType<T>;
      default:
        throw new Error('Unsupported range');
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const rows = await fetchSheetData(range);
        
        if (mounted) {
          const formatter = getFormatter();
          const formattedData = formatter(rows);
          setData(formattedData);
          setIsUsingMockData(false);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error(`Error loading sheet data for ${range}:`, err);
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
  }, [range]);

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