import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { useThemeStore } from '../store/themeStore';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  getRowProps?: (row: TData) => React.HTMLAttributes<HTMLTableRowElement>;
}

export function DataTable<TData>({ 
  data, 
  columns,
  getRowProps 
}: DataTableProps<TData>) {
  const { isDark } = useThemeStore();

  const table = useReactTable({
    data: data ?? [],
    columns: columns ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  // التأكد من وجود البيانات
  if (!data?.length || !columns?.length) {
    return (
      <div className={`${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      } rounded-xl shadow-sm overflow-hidden border p-8 text-center ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        لا توجد بيانات لعرضها
      </div>
    );
  }

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <div className={`${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    } rounded-xl shadow-sm overflow-hidden border`}>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className={`${
            isDark ? 'bg-gray-700/50' : 'bg-gray-50/50'
          }`}>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id} 
                    className={`px-6 py-4 text-sm font-semibold ${
                      isDark ? 'text-gray-200' : 'text-gray-900'
                    } first:rounded-tr-xl last:rounded-tl-xl`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={`${
            isDark ? 'divide-gray-700' : 'divide-gray-100'
          } divide-y`}>
            {rows.map((row) => (
              <tr 
                key={row.id}
                {...(getRowProps ? getRowProps(row.original) : {})}
                className={`${
                  isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td 
                    key={cell.id} 
                    className={`px-6 py-4 text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}