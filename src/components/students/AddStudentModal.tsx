import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApi } from '../../hooks/api/useApi';
import type { Student } from '../../types/student';
import LoadingSpinner from '../common/LoadingSpinner';
import { SERVER_CONFIG } from '../../config/server';

interface AddStudentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddStudentModal({ onClose, onSuccess }: AddStudentModalProps) {
  const { data: studentsData } = useApi<Student>('students');
  const [uniqueLevels, setUniqueLevels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    studentName: '',
    level: '',
    classNumber: '',
    phone: ''
  });

  // استخراج الحلقات الفريدة من البيانات
  useEffect(() => {
    if (studentsData) {
      console.log('Available levels:', Array.from(new Set(studentsData.map(student => student.level))));
      const levels = [
        'حلقة الإبتدائية',
        'حلقة المتوسطة والثانوية',
        'حلقة التلقين',
        'حلقة الكبار'
      ];
      setUniqueLevels(levels);
    }
  }, [studentsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Submitting form data:', formData);
    try {
      const response = await axios.post(`${SERVER_CONFIG.baseUrl}/api/students`, formData);
      console.log('Server response:', response.data);
      if (response.data) {
        await onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error adding student:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`حدث خطأ أثناء إضافة الطالب: ${error.response.data?.details || error.message}`);
      } else {
        alert('حدث خطأ أثناء إضافة الطالب');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto shadow-xl transform transition-all duration-200 scale-100`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">إضافة طالب جديد</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الهوية</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم الطالب</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحلقة</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              required
              disabled={isSubmitting}
            >
              <option value="">اختر الحلقة</option>
              {uniqueLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الحلقة</label>
            <input
              type="text"
              name="classNumber"
              value={formData.classNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الجوال</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  جاري الإضافة...
                </>
              ) : (
                'إضافة'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
