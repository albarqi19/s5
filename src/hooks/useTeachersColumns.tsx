import { ColumnDef } from '@tanstack/react-table';
import { Teacher } from '../types/student';
import { TeacherActions } from '../components/teachers/TeacherActions';

export function useTeachersColumns() {
  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: 'name',
      header: 'اسم المعلم',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          {row.original.name}
        </span>
      )
    },
    {
      accessorKey: 'points',
      header: 'النقاط المضافة',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
            {row.original.points || 0}
          </span>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'الإجراءات',
      cell: TeacherActions
    }
  ];

  return columns;
}