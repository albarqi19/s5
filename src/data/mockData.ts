import { Student, Teacher } from '../types/student';
import { Record } from '../types/record';

export const mockStudents: Student[] = [
  {
    id: "1",
    studentName: "أحمد محمد",
    level: "المستوى الأول",
    classNumber: "1",
    violations: "لا يوجد",
    parts: "الجزء الأول",
    points: 50,
    phone: "0501234567"
  },
  {
    id: "2",
    studentName: "عمر خالد",
    level: "المستوى الثاني",
    classNumber: "2",
    violations: "تأخر مرتين",
    parts: "الجزء الثاني",
    points: 45,
    phone: "0502345678"
  }
];

export const mockRecords: Record[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "أحمد محمد",
    pages: "10-15",
    reason: "حفظ جزء كامل",
    teacher: "محمد علي",
    dateTime: "2024-03-15 10:30",
    date: "2024-03-15",
    phoneNumber: "0501234567",
    teacherName: "محمد علي",
    totalPoints: 10,
    level: "المستوى الأول",
    badge: "متميز"
  },
  {
    id: "2",
    studentId: "2",
    studentName: "عمر خالد",
    pages: "20-25",
    reason: "تميز في المراجعة",
    teacher: "خالد أحمد",
    dateTime: "2024-03-14 11:45",
    date: "2024-03-14",
    phoneNumber: "0502345678",
    teacherName: "خالد أحمد",
    totalPoints: 5,
    level: "المستوى الثاني",
    badge: "مجتهد"
  }
];

export const mockTeachers: Teacher[] = [
  {
    name: "محمد علي",
    limit: 100,
    username: "m.ali"
  },
  {
    name: "خالد أحمد",
    limit: 80,
    username: "k.ahmed"
  }
];