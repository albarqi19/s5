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

// دالة لتوليد رقم عشوائي للمعرف
const generateRandomId = () => {
  return Math.floor(Math.random() * 900000000) + 100000000; // توليد رقم من 9 أرقام
};

// أنواع النقاط الإضافية (يمكن تغييرها حسب احتياجاتك)
const POINTS_TYPES = [
  { id: 'memorization', label: 'حفظ', points: 10 },
  { id: 'attendance', label: 'حضور', points: 5 },
  { id: 'goodBehavior', label: 'سلوك جيد', points: 15 },
  { id: 'activity', label: 'نشاط', points: 7 },
  { id: 'other', label: 'أخرى', points: 1 }
];

export function AddRecordForm({ onClose, onSuccess }: AddRecordFormProps) {
  const { isDark } = useThemeStore();
  const { showToast } = useToastStore();
  const { data: studentsData = [] } = useApi<Student>('students');
  const { data: teachersData = [] } = useApi<Teacher>('teachers');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    pointsType: '',
    customPoints: '5',
    reason: '',
    details: '',
    teacher: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.pointsType || !formData.teacher) {
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

      // تحديد النقاط بناءً على النوع المختار
      let points = parseInt(formData.customPoints);
      let pointsTypeText = formData.reason || 'أخرى'; // استخدام السبب المخصص إذا كان موجودًا
      
      if (formData.pointsType !== 'other') {
        const pointType = POINTS_TYPES.find(type => type.id === formData.pointsType);
        if (pointType) {
          points = pointType.points;
          pointsTypeText = pointType.label;
        }
      }

      // تأكد من أن points هي قيمة عددية صالحة
      if (isNaN(points)) {
        points = 5; // قيمة افتراضية إذا كانت النقاط غير صالحة
      }

      // توليد رقم عشوائي للمعرف
      const recordId = generateRandomId().toString();

      const now = new Date();
      
      // تنسيق الوقت: HH:MM:SS (24-hour format)
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      // تنسيق التاريخ: M/D/YYYY
      const dateString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

      const record = {
        id: recordId,
        studentId: formData.studentId,
        studentName: student.studentName,
        points: points.toString(),
        reason: pointsTypeText + (formData.details ? ` - ${formData.details}` : ''),
        teacher: teacher.id,
        teacherName: teacher.name,
        time: timeString,
        date: dateString,
        dateTime: now.toISOString(),
        phoneNumber: student.phone || '',
        level: student.level
      };

      // إرسال السجل إلى الخادم
      try {
        await axios.post(`${SERVER_CONFIG.baseUrl}/api/records/update-row`, {
          rowIndex: "append",
          violationData: record
        });
        
        showToast('تم إضافة سجل النقاط بنجاح', 'success');
        onSuccess();
        onClose();
      } catch (error) {
        console.error('Error updating Record Data:', error);
        showToast('حدث خطأ في تسجيل النقاط في جدول البيانات', 'error');
      }
    } catch (error) {
      console.error('Error adding record:', error);
      showToast('حدث خطأ أثناء إضافة سجل النقاط', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // الحصول على نوع النقاط المختار
  const selectedPointsType = POINTS_TYPES.find(type => type.id === formData.pointsType);

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
            نوع النقاط
          </label>
          <select
            name="pointsType"
            value={formData.pointsType}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
            required
            disabled={isSubmitting}
          >
            <option value="">اختر نوع النقاط</option>
            {POINTS_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.label} (+{type.points} نقطة)
              </option>
            ))}
          </select>
        </div>

        {formData.pointsType === 'other' && (
          <>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                سبب إضافة النقاط
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="أدخل سبب إضافة النقاط"
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
                عدد النقاط المضافة
              </label>
              <input
                type="number"
                name="customPoints"
                value={formData.customPoints}
                onChange={handleChange}
                min="1"
                className={`w-full p-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                required
                disabled={isSubmitting}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                أدخل قيمة موجبة للنقاط المضافة
              </p>
            </div>
          </>
        )}

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            تفاصيل إضافية
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={3}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
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

        {formData.studentId && formData.pointsType && (
          <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-50'} mt-4`}>
            <h3 className={`font-medium ${isDark ? 'text-green-300' : 'text-green-600'}`}>ملخص إضافة النقاط</h3>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              سيتم إضافة {formData.pointsType === 'other' ? parseInt(formData.customPoints) : (selectedPointsType?.points || 0)} نقطة 
              للطالب {studentsData.find(s => s.id === formData.studentId)?.studentName}
            </p>
            {formData.pointsType === 'other' && formData.reason && (
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                السبب: {formData.reason}
              </p>
            )}
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              سيتم إضافة سجل النقاط في أول صف فارغ في جدول البيانات.
            </p>
          </div>
        )}

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
            className={`px-4 py-2 rounded-lg transition-colors bg-green-600 text-white hover:bg-green-700 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إضافة النقاط'}
          </button>
        </div>
      </form>
    </div>
  );
}