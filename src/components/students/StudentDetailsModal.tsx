import React, { useState } from 'react';
import { X } from '../icons';
import type { Student } from '../../types/student';
import { useThemeStore } from '../../store/themeStore';
import { Modal } from '../Modal';
import { StudentCard } from './StudentCard';

interface StudentDetailsModalProps {
  student: Student;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  isOpen: boolean;
}

export function StudentDetailsModal({ student, onClose, onEdit, onDelete, isOpen }: StudentDetailsModalProps) {
  const { isDark } = useThemeStore();
  const [showCard, setShowCard] = useState(false);

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 relative`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {!showCard ? (
            <>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                تفاصيل الطالب
              </h2>

              {/* رأس النافذة مع معلومات الطالب الرئيسية */}
              <div className={`p-6 ${isDark ? 'bg-gray-700' : 'bg-blue-500'} text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{student.studentName}</h2>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        الرقم: {student.id}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        student.points >= 80 ? 'bg-green-500' :
                        student.points >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {student.points} نقطة
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* محتوى النافذة */}
              <div className="p-6">
                {/* معلومات الحلقة والمستوى */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 rounded-lg ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div>
                    <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} mb-2`}>
                      معلومات الحلقة
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm opacity-75">الحلقة:</label>
                        <p className="text-lg font-medium">{student.level}</p>
                      </div>
                      <div>
                        <label className="text-sm opacity-75">رقم الحلقة:</label>
                        <p className="text-lg font-medium">{student.classNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} mb-2`}>
                      المستوى الدراسي
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm opacity-75">المستوى الحالي:</label>
                        <p className="text-lg font-medium">{student.parts}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* الإحصائيات */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <span className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>النقاط</span>
                    <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {student.points}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <span className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>المخالفات</span>
                    <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      {student.violations}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'} md:col-span-1 col-span-2`}>
                    <span className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>رقم الهاتف</span>
                    <p className={`text-lg font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {student.phone || 'غير متوفر'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 space-x-reverse mt-6">
                <button
                  onClick={() => setShowCard(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  طباعة البطاقة
                </button>
                <button
                  onClick={() => onEdit(student)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => onDelete(student)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  حذف
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowCard(false)}
                className="mb-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                العودة للتفاصيل
              </button>
              <StudentCard student={student} />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}