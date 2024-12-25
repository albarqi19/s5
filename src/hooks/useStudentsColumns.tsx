import { ColumnDef } from '@tanstack/react-table';
import { Student } from '../types/student';
import { StudentActions } from '../components/students/StudentActions';
import { useThemeStore } from '../store/themeStore';

interface UseStudentsColumnsProps {
  onStudentSelect: (student: Student) => void;
}

export function useStudentsColumns({ onStudentSelect }: UseStudentsColumnsProps) {
  const { isDark } = useThemeStore();

  const getLevelColor = (level: string) => {
    const colors = {
      'المستوى الأول': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'المستوى الثاني': { bg: 'bg-green-100', text: 'text-green-800' },
      'المستوى الثالث': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'المستوى الرابع': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'المستوى الخامس': { bg: 'bg-pink-100', text: 'text-pink-800' },
      'المستوى السادس': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    };
    return colors[level] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'studentName',
      header: 'اسم الطالب',
      cell: ({ row }) => (
        <button
          onClick={() => onStudentSelect(row.original)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {row.original.studentName}
        </button>
      )
    },
    {
      accessorKey: 'level',
      header: 'المستوى',
      cell: ({ row }) => {
        const { bg, text } = getLevelColor(row.original.level);
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium ${bg} ${text}`}>
            {row.original.level}
          </span>
        );
      }
    },
    {
      accessorKey: 'classNumber',
      header: 'رقم الحلقة',
      cell: ({ row }) => (
        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {row.original.classNumber}
        </span>
      )
    },
    {
      accessorKey: 'parts',
      header: 'المستوى الحالي',
      cell: ({ row }) => (
        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {row.original.parts}
        </span>
      )
    },
    {
      accessorKey: 'points',
      header: 'النقاط',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
          isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
        }`}>
          {row.original.points}
        </span>
      )
    },
    {
      accessorKey: 'violations',
      header: 'المخالفات',
      cell: ({ row }) => (
        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {row.original.violations}
        </span>
      )
    },
    {
      accessorKey: 'phone',
      header: 'الجوال',
      cell: ({ row }) => (
        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {row.original.phone}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'الإجراءات',
      cell: StudentActions
    }
  ];

  return columns;
}