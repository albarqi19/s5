import React, { useState } from 'react';
import { useApi } from '../../hooks/api/useApi';
import { SERVER_CONFIG } from '../../config/server';
import { useThemeStore } from '../../store/themeStore';
import { useToastStore } from '../../store/toastStore';
import type { Student } from '../../types/student';
import type { Teacher } from '../../types/teacher';
import axios from 'axios';

interface AddRecordFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRecordForm({ onClose, onSuccess }: AddRecordFormProps) {
  const { isDark } = useThemeStore();
  const { showToast } = useToastStore();
  const { data: studentsData = [] } = useApi<Student>('students');
  const { data: teachersData = [] } = useApi<Teacher>('teachers');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    pages: '',
    reason: '',
    teacher: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.pages || !formData.reason || !formData.teacher) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // العثور على الطالب والمعلم لإضافة بياناتهما إلى السجل
      const student = studentsData.find(s => s.id === formData.studentId);
      const teacher = teachersData.find(t => t.id === formData.teacher);
      
      if (!student) {
        showToast('لم يتم العثور على بيانات الطالب', 'error');
        return;
      }

      if (!teacher) {
        showToast('لم يتم العثور على بيانات المعلم', 'error');
        return;
      }

      const now = new Date();
      const record = {
        studentId: formData.studentId,
        studentName: student.studentName,
        pages: parseInt(formData.pages),
        reason: formData.reason,
        teacher: teacher.id,
        teacherName: teacher.name,
        dateTime: now.toISOString(),
        date: now.toLocaleDateString('ar-SA'),
        level: student.level
      };

      await axios.post(`${SERVER_CONFIG.baseUrl}/api/records`, record);
      
      showToast('تم إضافة السجل بنجاح', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding record:', error);
      showToast('حدث خطأ أثناء إضافة السجل', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-2xl mx-auto`}>
      <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        إضافة سجل نقاط جديد
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            الطالب
          </label>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
            required
            disabled={isSubmitting}
          >
            <option value="">اختر الطالب</option>
            {studentsData.map(student => (
              <option key={student.id} value={student.id}>
                {student.studentName} - {student.level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            عدد الصفحات / النقاط
          </label>
          <input
            type="number"
            name="pages"
            min="1"
            value={formData.pages}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            السبب
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            المعلم
          </label>
          <select
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
            required
            disabled={isSubmitting}
          >
            <option value="">اختر المعلم</option>
            {teachersData.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDark 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={isSubmitting}
          >
            إلغاء
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إضافة السجل'}
          </button>
        </div>
      </form>
    </div>
  );
}