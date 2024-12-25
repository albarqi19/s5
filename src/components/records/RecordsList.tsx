import React from 'react';
import { DataTable } from '../DataTable';
import type { Record } from '../../types/record';
import { RecordActions } from './RecordActions';

const columns = [
  {
    accessorKey: 'date',
    header: 'التاريخ'
  },
  {
    accessorKey: 'time',
    header: 'الوقت'
  },
  {
    accessorKey: 'studentName',
    header: 'اسم الطالب'
  },
  {
    accessorKey: 'pages',
    header: 'الصفحات'
  },
  {
    accessorKey: 'reason',
    header: 'السبب'
  },
  {
    accessorKey: 'teacher',
    header: 'المعلم'
  },
  {
    accessorKey: 'totalPoints',
    header: 'النقاط'
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: RecordActions
  }
];

interface RecordsListProps {
  records: Record[];
  onEdit: (record: Record) => void;
  onDelete: (id: string) => void;
  onStudentClick: (studentId: string) => void;
}

export function RecordsList({ records, onEdit, onDelete, onStudentClick }: RecordsListProps) {
  const enhancedColumns = columns.map(column => {
    if (column.accessorKey === 'studentName') {
      return {
        ...column,
        cell: ({ row }) => (
          <button
            onClick={() => onStudentClick(row.original.studentId)}
            className="text-blue-600 hover:underline text-right"
          >
            {row.original.studentName}
          </button>
        )
      };
    }
    return column;
  });

  return <DataTable data={records} columns={enhancedColumns} />;
}