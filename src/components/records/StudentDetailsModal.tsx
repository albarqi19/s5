import React from 'react';
import type { StudentDetails } from '../../types/record';

interface StudentDetailsModalProps {
  student: StudentDetails | null;
  onClose: () => void;
}

export function StudentDetailsModal({ student, onClose }: StudentDetailsModalProps) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">تفاصيل الطالب</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">اسم الطالب</label>
              <p className="mt-1">{student.studentName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">المستوى</label>
              <p className="mt-1">{student.level}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">مجموع النقاط</label>
              <p className="mt-1">{student.totalPoints}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">سجل النقاط</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">التاريخ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">النقاط</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">السبب</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {student.records.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.totalPoints}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}