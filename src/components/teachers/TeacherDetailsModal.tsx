import React from 'react';
import { Teacher } from '../../types/teacher';
import { useThemeStore } from '../../store/themeStore';
import { Modal } from '../Modal';

interface TeacherDetailsModalProps {
  teacher: Teacher;
  onClose: () => void;
}

export function TeacherDetailsModal({ teacher, onClose }: TeacherDetailsModalProps) {
  const { isDark } = useThemeStore();

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-3 border-b last:border-b-0">
      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );

  return (
    <Modal onClose={onClose}>
      <div className={`w-full max-w-lg rounded-xl shadow-lg ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            تفاصيل المعلم
          </h2>

          <div className="space-y-1">
            <DetailRow label="الاسم" value={teacher.name} />
            <DetailRow label="الحد" value={teacher.limit} />
            <DetailRow label="المستخدم" value={teacher.used} />
            <DetailRow label="المتبقي" value={teacher.remaining} />
            <DetailRow label="الرقم" value={teacher.number} />
            {teacher.points !== undefined && (
              <DetailRow label="مجموع النقاط المضافة" value={teacher.points} />
            )}
          </div>
        </div>

        <div className={`p-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
