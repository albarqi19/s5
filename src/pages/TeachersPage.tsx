import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { useThemeStore } from '../store/themeStore';
import { useApi } from '../hooks/api/useApi';
import { Teacher } from '../types/teacher';
import { TeacherDetailsModal } from '../components/teachers/TeacherDetailsModal';

export function TeachersPage() {
  const { isDark } = useThemeStore();
  const { data: teachers = [], isLoading } = useApi<Teacher[]>('teachers');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  if (isLoading) {
    return (
      <PageLayout>
        <div className={`flex items-center justify-center min-h-[400px] ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          جاري التحميل...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className={`p-6 rounded-xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              المعلمين
            </h1>
            <p className={`mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              عرض وإدارة بيانات المعلمين
            </p>
          </div>
          
          <button
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <span className="ml-2">+</span>
            إضافة معلم
          </button>
        </div>

        <div className={`rounded-xl overflow-hidden ${
          isDark ? 'bg-gray-900/50' : 'bg-gray-50'
        }`}>
          <div className={`px-6 py-4 border-b ${
            isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                إجمالي المعلمين
              </span>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {teachers.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${
                  isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                }`}>
                  <th className={`px-6 py-4 text-right text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    اسم المعلم
                  </th>
                  <th className={`px-6 py-4 text-center text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    النقاط المضافة
                  </th>
                  <th className={`px-6 py-4 text-center text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className={`${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              } divide-y`}>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className={`${
                    isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                  } transition-colors`}>
                    <td 
                      className={`px-6 py-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-900'
                      } cursor-pointer hover:text-blue-500 transition-colors`}
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      {teacher.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                          isDark 
                            ? 'bg-blue-900/30 text-blue-300' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {teacher.limit || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                        <button className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? 'hover:bg-gray-700 text-red-400 hover:text-red-300'
                            : 'hover:bg-gray-100 text-red-600 hover:text-red-700'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTeacher && (
        <TeacherDetailsModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
    </PageLayout>
  );
}