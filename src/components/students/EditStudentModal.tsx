import React, { useState, useEffect } from 'react';
import { Student } from '../../types/student';
import { useApi } from '../../hooks/api/useApi';
import { SERVER_CONFIG } from '../../config/server';
import axios from 'axios';
import { Modal } from '../Modal';
import { useThemeStore } from '../../store/themeStore';

interface EditStudentModalProps {
  student: Student;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditStudentModal({ student, onClose, onSuccess }: EditStudentModalProps) {
  const { isDark } = useThemeStore();
  const { data: studentsData } = useApi<Student>('students');
  const [uniqueLevels, setUniqueLevels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phone: student.phone,
    level: student.level
  });

  useEffect(() => {
    if (studentsData) {
      const levels = new Set(studentsData.map(student => student.level));
      setUniqueLevels(Array.from(levels).filter(Boolean).sort());
    }
  }, [studentsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(`${SERVER_CONFIG.baseUrl}/api/students/${student.id}`, formData);
      if (response.data) {
        await onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal onClose={onClose}>
      <div className={`w-full max-w-lg rounded-xl shadow-lg ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            تعديل بيانات الطالب
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="studentName" 
                className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                اسم الطالب
              </label>
              <input
                type="text"
                id="studentName"
                value={student.studentName}
                disabled
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-300' 
                    : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label 
                htmlFor="phone" 
                className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                رقم الهاتف
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label 
                htmlFor="level" 
                className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                المستوى
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="">اختر المستوى</option>
                {uniqueLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className={`p-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                isSubmitting
                  ? 'bg-blue-500 opacity-50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
