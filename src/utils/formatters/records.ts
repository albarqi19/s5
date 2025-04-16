import type { Record } from '../../types/record';

export function formatRecords(rows: any[]): Record[] {
  return rows.map(row => ({
    id: row[0]?.toString() || '',
    studentId: row[1]?.toString() || '',
    studentName: row[2]?.toString() || '',
    pages: parseInt(row[3]?.toString() || '0'),  // تحويل الصفحات إلى رقم بدلاً من نص
    reason: row[4]?.toString() || '',
    teacher: row[5]?.toString() || '',
    dateTime: row[6]?.toString() || '',
    date: row[7]?.toString() || '',
    phoneNumber: row[8]?.toString() || '',
    teacherName: row[9]?.toString() || '',
    totalPoints: parseInt(row[10]?.toString() || '0'),
    level: row[11]?.toString() || '',
    badge: row[12]?.toString() || ''
  }));
}