import React from 'react';
import { X } from '../icons';
import type { Student } from '../../types/student';
import { useThemeStore } from '../../store/themeStore';
import { Modal } from '../Modal';

interface StudentDetailsModalProps {
  student: Student;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isOpen: boolean;
}

export function StudentDetailsModal({ student, onClose, onEdit, onDelete, isOpen }: StudentDetailsModalProps) {
  const { isDark } = useThemeStore();
  
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all duration-300 scale-100`}>
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

        {/* شريط الإجراءات */}
        <div className={`p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } flex justify-end space-x-3 rtl:space-x-reverse`}>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            حذف الطالب
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            تعديل البيانات
          </button>
        </div>
      </div>
    </Modal>
  );
}