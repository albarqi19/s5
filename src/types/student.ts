export interface Student {
  rowIndex: number;
  id: string;
  studentName: string;
  level: string;
  classNumber: string; // الصف
  violations: string; // المخالفات
  parts: string;
  points: number; // جميع النقاط
  phone: string; // الجوال
  currentLevel: string;
}

export interface Teacher {
  name: string; // NAME
  limit: number; // الحد
  username: string; // المستخدم
}