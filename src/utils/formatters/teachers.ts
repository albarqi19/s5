import type { Teacher } from '../../types/student';

export function formatTeachers(rows: any[]): Teacher[] {
  return rows.map(row => ({
    name: row[0]?.toString() || '',
    limit: parseInt(row[1]?.toString() || '0'),
    username: row[2]?.toString() || ''
  }));
}