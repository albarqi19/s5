import type { Student, Teacher } from '../types/student';
import type { Record } from '../types/record';

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

export function formatRecords(rows: any[]): Record[] {
  return rows.map(row => ({
    id: row[0]?.toString() || '',
    studentId: row[1]?.toString() || '',
    studentName: row[2]?.toString() || '',
    pages: row[3]?.toString() || '',
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

export function formatTeachers(rows: any[]): Teacher[] {
  return rows.map(row => ({
    name: row[0]?.toString() || '',
    limit: parseInt(row[1]?.toString() || '0'),
    username: row[2]?.toString() || ''
  }));
}