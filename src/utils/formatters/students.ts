import type { Student } from '../../types/student';

export function formatStudents(rows: any[]): Student[] {
  return rows.map(row => ({
    id: row[0]?.toString() || '',
    studentName: row[1]?.toString() || '',
    level: row[2]?.toString() || '',
    classNumber: row[3]?.toString() || '',
    violations: row[4]?.toString() || '',
    parts: row[5]?.toString() || '',
    points: parseInt(row[6]?.toString() || '0'),
    phone: row[7]?.toString() || ''
  }));
}