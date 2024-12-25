import { fetchSheetData } from '../lib/googleSheets';
import { SHEETS_CONFIG } from '../config/sheets.config';
import type { Student } from '../types/student';
import type { Record } from '../types/record';
import type { Teacher } from '../types/student';

class SheetsService {
  async fetchAllData() {
    try {
      const [studentsData, recordsData, teachersData] = await Promise.all([
        fetchSheetData(SHEETS_CONFIG.ranges.students),
        fetchSheetData(SHEETS_CONFIG.ranges.records),
        fetchSheetData(SHEETS_CONFIG.ranges.teachers)
      ]);

      return {
        students: this.formatStudents(studentsData),
        records: this.formatRecords(recordsData),
        teachers: this.formatTeachers(teachersData)
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  private formatStudents(rows: any[]): Student[] {
    if (!Array.isArray(rows)) return [];
    return rows.map(row => ({
      id: row[0]?.toString() || '',
      studentName: row[1]?.toString() || '',
      level: row[2]?.toString() || '',
      classNumber: row[3]?.toString() || '',
      violations: row[4]?.toString() || 'لا يوجد',
      parts: row[5]?.toString() || '',
      points: parseInt(row[6]?.toString() || '0'),
      phone: row[7]?.toString() || ''
    }));
  }

  private formatRecords(rows: any[]): Record[] {
    if (!Array.isArray(rows)) return [];
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

  private formatTeachers(rows: any[]): Teacher[] {
    if (!Array.isArray(rows)) return [];
    return rows.map(row => ({
      name: row[0]?.toString() || '',
      limit: parseInt(row[1]?.toString() || '0'),
      username: row[2]?.toString() || ''
    }));
  }
}

export const sheetsService = new SheetsService();