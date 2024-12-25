import { useState, useEffect } from 'react';
import { fetchSheetData } from '../lib/sheets/api';
import { formatStudents, formatRecords, formatTeachers } from '../utils/formatters/index';
import type { Student, Teacher } from '../types/student';
import type { Record } from '../types/record';

interface SheetData {
  students: Student[];
  records: Record[];
  teachers: Teacher[];
}

export function useGoogleSheets() {
  const [data, setData] = useState<SheetData>({
    students: [],
    records: [],
    teachers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [studentsData, recordsData, teachersData] = await Promise.all([
          fetchSheetData('students'),
          fetchSheetData('records'),
          fetchSheetData('teachers')
        ]);

        if (isMounted) {
          setData({
            students: formatStudents(studentsData),
            records: formatRecords(recordsData),
            teachers: formatTeachers(teachersData)
          });
        }
      } catch (err) {
        if (isMounted) {
          setError('حدث خطأ في تحميل البيانات');
          console.error('Error fetching data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { ...data, loading, error };
}