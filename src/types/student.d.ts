export interface Student {
  id: string;
  studentName: string;
  level: string;
  classNumber: string;
  violations: string;
  parts: string;
  points: number;
  phone: string;
  currentLevel: string;
}

export interface Teacher {
  id: string;
  name: string;
  points: number;  // النقاط المضافة للمعلم
}
