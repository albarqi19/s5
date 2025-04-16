import React, { useMemo } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useToastStore } from '../../store/toastStore';
import { useApi } from '../../hooks/api/useApi';
import { Modal } from '../Modal';
import type { Teacher } from '../../types/teacher';
import type { Student } from '../../types/student';
import { Users, Phone, Mail, Award } from 'lucide-react';

interface TeacherDetailsModalProps {
  teacher: Teacher;
  onClose: () => void;
  onEdit?: (teacher: Teacher) => void;
  onDelete?: (teacher: Teacher) => void;
}

export function TeacherDetailsModal({ teacher, onClose, onEdit, onDelete }: TeacherDetailsModalProps) {
  const { isDark } = useThemeStore();
  const { showToast } = useToastStore();
  const { data: allStudents = [] } = useApi<Student>('students');

  const teacherStudents = useMemo(() => {
    if (!allStudents?.length) return [];
    return allStudents.filter(student => student.level === teacher.circle);
  }, [allStudents, teacher.circle]);

  const studentStats = useMemo(() => {
    if (!teacherStudents.length) return null;

    const totalPoints = teacherStudents.reduce((sum, student) => sum + student.points, 0);
    const averagePoints = Math.round(totalPoints / teacherStudents.length);

    const excellentStudents = teacherStudents.filter(student => student.points >= 80);
    const needSupportStudents = teacherStudents.filter(student => student.points < 40);

    return {
      totalStudents: teacherStudents.length,
      averagePoints,
      excellentCount: excellentStudents.length,
      needSupportCount: needSupportStudents.length
    };
  }, [teacherStudents]);

  const handleEdit = () => {
    if (onEdit) onEdit(teacher);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(teacher);
  };

  const handleWhatsApp = () => {
    if (!teacher.phone) {
      showToast('رقم الهاتف غير متوفر', 'error');
      return;
    }

    let phoneNumber = teacher.phone.replace(/\D/g, '');
    if (!phoneNumber.startsWith('966') && !phoneNumber.startsWith('+966')) {
      phoneNumber = phoneNumber.startsWith('0') ? `966${phoneNumber.substring(1)}` : `966${phoneNumber}`;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Modal onClose={onClose}>
      <div className={`relative rounded-xl overflow-hidden ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <div className={`px-6 py-8 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${
                isDark ? 'bg-blue-600/40 text-blue-300' : 'bg-blue-200 text-blue-700'
              }`}>
                <Users size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{teacher.name}</h2>
                <p className={`${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{teacher.circle || 'لم يتم تحديد الحلقة'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                <Phone size={18} />
              </div>
              <div className="mr-3">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>الهاتف</p>
                <p className="font-medium dir-ltr text-left">{teacher.phone || 'غير متوفر'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                <Mail size={18} />
              </div>
              <div className="mr-3">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>البريد الإلكتروني</p>
                <p className="font-medium dir-ltr text-left">{teacher.email || 'غير متوفر'}</p>
              </div>
            </div>
          </div>
        </div>

        {studentStats && (
          <div className="p-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>إحصائيات الطلاب</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <Users size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                  <span className={`text-sm mr-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>عدد الطلاب</span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {studentStats.totalStudents}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <Award size={16} className={isDark ? 'text-yellow-400' : 'text-yellow-600'} />
                  <span className={`text-sm mr-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>متوسط النقاط</span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {studentStats.averagePoints}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <Award size={16} className={isDark ? 'text-green-400' : 'text-green-600'} />
                  <span className={`text-sm mr-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>طلاب متميزون</span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {studentStats.excellentCount}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <Award size={16} className={isDark ? 'text-red-400' : 'text-red-600'} />
                  <span className={`text-sm mr-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>بحاجة للدعم</span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {studentStats.needSupportCount}
                </p>
              </div>
            </div>
          </div>
        )}

        {teacherStudents.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>طلاب الحلقة</h3>

            <div className={`rounded-lg overflow-hidden border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <table className="w-full">
                <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold">اسم الطالب</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">المستوى</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">النقاط</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isDark ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {teacherStudents.map((student) => (
                    <tr key={student.id} className={isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3">{student.studentName}</td>
                      <td className="px-4 py-3">{student.parts}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                          student.points >= 80 ? 'bg-green-100 text-green-800' :
                          student.points >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {student.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className={`px-6 py-4 flex justify-end gap-2 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            إغلاق
          </button>
          {teacher.phone && (
            <button
              onClick={handleWhatsApp}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                isDark ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="ml-2">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 1.82.54 3.53 1.44 4.97L2.1 22l5.03-1.34A9.857 9.857 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1.46 14.75h-.02c-1.4 0-2.76-.4-3.93-1.15l-.28-.17-2.93.77.78-2.86-.18-.29c-.82-1.3-1.25-2.8-1.25-4.32 0-4.5 3.66-8.17 8.17-8.17 2.18 0 4.23.85 5.77 2.39a8.08 8.08 0 0 1 2.39 5.77c0 4.51-3.67 8.17-8.17 8.17zm4.48-6.12c-.25-.12-1.47-.72-1.69-.81s-.39-.12-.56.12c-.16.25-.63.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.25-.44.08-.18.04-.34-.02-.47-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.02-.31-.02-.48-.02-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.41 1.02 2.57.12.17 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18s.21-1.08.14-1.18c-.06-.08-.23-.14-.48-.27z"/>
              </svg>
              واتساب
            </button>
          )}
          {onEdit && (
            <button
              onClick={handleEdit}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              تعديل
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              حذف
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
