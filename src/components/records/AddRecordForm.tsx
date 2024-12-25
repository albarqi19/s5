import React from 'react';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';

interface AddRecordFormProps {
  onSubmit: (data: any) => void;
}

export function AddRecordForm({ onSubmit }: AddRecordFormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Handle form submission
    }} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">اسم الطالب</label>
          <input
            type="text"
            name="studentName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">الصفحات</label>
          <input
            type="text"
            name="pages"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">السبب</label>
          <input
            type="text"
            name="reason"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">المعلم</label>
          <input
            type="text"
            name="teacher"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" icon={Plus}>
          إضافة سجل
        </Button>
      </div>
    </form>
  );
}