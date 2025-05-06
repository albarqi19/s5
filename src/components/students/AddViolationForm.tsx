import React, { useState } from 'react';
import { useApi } from '../../hooks/api/useApi';
import { SERVER_CONFIG } from '../../config/server';
import { useThemeStore } from '../../store/themeStore';
import { useToastStore } from '../../store/toastStore';
import type { Student } from '../../types/student';
import axios from 'axios';

interface AddViolationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

// تحديث قائمة أنواع المخالفات (حذف عدم حل الواجب)
const VIOLATION_TYPES = [
  { id: 'absence', label: 'غياب', points: -5 },
  { id: 'late', label: 'تأخر', points: -3 },
  { id: 'misbehavior', label: 'سوء سلوك', points: -10 },
  { id: 'disrespect', label: 'الاساءة', points: -25 },
  { id: 'other', label: 'أخرى', points: -1 }
];

// دالة لتوليد رقم عشوائي
const generateRandomId = () => {
  return Math.floor(Math.random() * 900000000) + 100000000; // توليد رقم من 9 أرقام
};

export function AddViolationForm({ onClose, onSuccess }: AddViolationFormProps) {
  const { isDark } = useThemeStore();
  const { showToast } = useToastStore();
  const { data: studentsData = [] } = useApi<Student>('students');
  const { data: recordsData = [] } = useApi('records');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    violationType: '',
    customPoints: '-5',
    details: '',
    otherReason: '' // إضافة حقل سبب آخر
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.violationType) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // العثور على الطالب لإضافة بياناته إلى سجل المخالفة
      const student = studentsData.find(s => s.id === formData.studentId);
      
      if (!student) {
        showToast('لم يتم العثور على بيانات الطالب', 'error');
        return;
      }

      // تحديد النقاط بناءً على نوع المخالفة
      let points = parseInt(formData.customPoints);
      let violationTypeText = formData.otherReason || 'أخرى'; // استخدام السبب الآخر إذا كان موجودًا
      
      if (formData.violationType !== 'other') {
        const violationType = VIOLATION_TYPES.find(type => type.id === formData.violationType);
        if (violationType) {
          points = violationType.points;
          violationTypeText = violationType.label;
        }
      }

      // تأكد من أن points هي قيمة عددية صالحة
      if (isNaN(points)) {
        points = -5; // قيمة افتراضية إذا كانت النقاط غير صالحة
      }

      // توليد رقم عشوائي للمعرف
      const recordId = generateRandomId().toString();

      // تنسيق الوقت والتاريخ باللغة الإنجليزية والتاريخ الميلادي
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
      
      // إضافة المخالفة إلى جدول البيانات فقط (بدون تعديل نقاط الطالب مباشرة)
      try {
        console.log('Sending violation data:', {
          rowIndex: "append",
          violationData: {
            id: recordId, // استخدام معرف عشوائي
            studentId: student.id,
            studentName: student.studentName,
            points: points.toString(),
            reason: violationTypeText + (formData.details ? ` - ${formData.details}` : ''),
            teacherId: '', 
            time: timeString,
            date: dateString,
            phoneNumber: student.phone || '',
            teacherName: '', 
          }
        });
        
        const response = await axios.post(`${SERVER_CONFIG.baseUrl}/api/records/update-row`, {
          rowIndex: "append", 
          violationData: {
            id: recordId, // استخدام معرف عشوائي
            studentId: student.id,
            studentName: student.studentName,
            points: points.toString(),
            reason: violationTypeText + (formData.details ? ` - ${formData.details}` : ''),
            teacherId: '',
            time: timeString,
            date: dateString,
            phoneNumber: student.phone || '',
            teacherName: '',
          }
        });
        
        console.log('Server response:', response.data);
        showToast('تم تسجيل المخالفة بنجاح', 'success');
        
        onSuccess();
        onClose();
      } catch (error) {
        console.error('Error updating Record Data:', error);
        showToast('حدث خطأ في تسجيل المخالفة في جدول البيانات', 'error');
      }
    } catch (error) {
      console.error('Error adding violation:', error);
      showToast('حدث خطأ أثناء تسجيل المخالفة', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // الحصول على نوع المخالفة المختار
  const selectedViolationType = VIOLATION_TYPES.find(type => type.id === formData.violationType);

  return (
    <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-2xl mx-auto`}>
      <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        تسجيل مخالفة جديدة
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
            نوع المخالفة
          </label>
          <select
            name="violationType"
            value={formData.violationType}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
            required
            disabled={isSubmitting}
          >
            <option value="">اختر نوع المخالفة</option>
            {VIOLATION_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.label} ({type.points} نقطة)
              </option>
            ))}
          </select>
        </div>

        {formData.violationType === 'other' && (
          <>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                سبب المخالفة
              </label>
              <input
                type="text"
                name="otherReason"
                value={formData.otherReason}
                onChange={handleChange}
                placeholder="أدخل سبب المخالفة"
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
                النقاط المخصومة
              </label>
              <input
                type="number"
                name="customPoints"
                value={formData.customPoints}
                onChange={handleChange}
                max="0"
                className={`w-full p-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                required
                disabled={isSubmitting}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                أدخل قيمة سالبة للنقاط المخصومة
              </p>
            </div>
          </>
        )}

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            تفاصيل المخالفة
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

        {formData.studentId && formData.violationType && (
          <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-50'} mt-4`}>
            <h3 className={`font-medium ${isDark ? 'text-red-300' : 'text-red-600'}`}>ملخص المخالفة</h3>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              سيتم خصم {formData.violationType === 'other' ? Math.abs(parseInt(formData.customPoints)) : Math.abs(selectedViolationType?.points || 0)} نقطة 
              من الطالب {studentsData.find(s => s.id === formData.studentId)?.studentName}
            </p>
            {formData.violationType === 'other' && formData.otherReason && (
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                السبب: {formData.otherReason}
              </p>
            )}
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              سيتم إضافة المخالفة في أول صف فارغ في جدول البيانات.
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
            className={`px-4 py-2 rounded-lg transition-colors bg-red-600 text-white hover:bg-red-700 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري التسجيل...' : 'تسجيل المخالفة'}
          </button>
        </div>
      </form>
    </div>
  );
}