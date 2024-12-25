import React from 'react';
import { Record } from '../types/record';
import { useThemeStore } from '../store/themeStore';
import { Modal } from './Modal';

interface RecordDetailsModalProps {
  record: Record;
  onClose: () => void;
}

export function RecordDetailsModal({ record, onClose }: RecordDetailsModalProps) {
  const { isDark } = useThemeStore();

  const DetailRow = ({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) => (
    <div className="flex justify-between items-center py-3 border-b last:border-b-0">
      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      <span className={`font-medium ${
        highlight
          ? isDark 
            ? 'text-blue-400' 
            : 'text-blue-600'
          : isDark 
            ? 'text-gray-200' 
            : 'text-gray-900'
      }`}>
        {value}
      </span>
    </div>
  );

  return (
    <Modal onClose={onClose}>
      <div className={`w-full max-w-2xl rounded-xl shadow-lg ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            تفاصيل السجل
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <DetailRow label="معرف السجل" value={record.id} />
              <DetailRow label="رقم الهوية" value={record.studentId} />
              <DetailRow label="اسم الطالب" value={record.studentName} highlight />
              <DetailRow label="النقاط" value={record.pages} highlight />
              <DetailRow label="السبب" value={record.reason} />
              <DetailRow label="المعلم" value={record.teacher} />
            </div>
            <div className="space-y-1">
              <DetailRow label="التاريخ والوقت" value={record.dateTime} />
              <DetailRow label="التاريخ" value={record.date} />
              <DetailRow label="رقم الطالب" value={record.phoneNumber} />
              <DetailRow label="اسم المعلم" value={record.teacherName} />
              <DetailRow label="مجموع النقاط" value={record.totalPoints} highlight />
              <DetailRow label="المستوى" value={record.level} />
            </div>
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
