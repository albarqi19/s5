import { type ColumnDef } from '@tanstack/react-table';
import { type Record } from '../types/record';
import { useThemeStore } from '../store/themeStore';

interface UseRecordsColumnsProps {
  onRecordClick: (record: Record) => void;
}

export function useRecordsColumns({ onRecordClick }: UseRecordsColumnsProps) {
  const { isDark } = useThemeStore();
  
  const columns: ColumnDef<Record, any>[] = [
    {
      accessorKey: 'date',
      header: 'التاريخ',
      cell: ({ row }) => (
        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {row.original.date}
        </span>
      )
    },
    {
      accessorKey: 'studentName',
      header: 'اسم الطالب',
      cell: ({ row }) => (
        <span className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {row.original.studentName}
        </span>
      )
    },
    {
      accessorKey: 'pages',
      header: 'النقاط',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
          isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
        }`}>
          {row.original.pages}
        </span>
      )
    },
    {
      accessorKey: 'reason',
      header: 'السبب',
      cell: ({ row }) => (
        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {row.original.reason}
        </span>
      )
    },
    {
      accessorKey: 'teacherName',
      header: 'المعلم',
      cell: ({ row }) => (
        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {row.original.teacherName}
        </span>
      )
    },
    {
      accessorKey: 'totalPoints',
      header: 'مجموع النقاط',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
          isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
        }`}>
          {row.original.totalPoints}
        </span>
      )
    },
    {
      accessorKey: 'level',
      header: 'المستوى',
      cell: ({ row }) => (
        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {row.original.level}
        </span>
      )
    }
  ];

  return {
    columns,
    getRowProps: (row: Record) => ({
      onClick: () => onRecordClick(row),
      className: `cursor-pointer transition-colors duration-200`
    })
  };
}