import React, { useMemo } from 'react';
import { useThemeStore } from '../../store/themeStore';
import type { Student } from '../../types/student';
import { TrendingUp, TrendingDown, Award, Users, Activity } from 'lucide-react';

interface StudentsDashboardProps {
  students: Student[];
}

export function StudentsDashboard({ students }: StudentsDashboardProps) {
  const { isDark } = useThemeStore();

  const stats = useMemo(() => {
    if (!students?.length) return null;
    
    // حساب متوسط النقاط
    const totalPoints = students.reduce((sum, student) => sum + (student.points || 0), 0);
    const averagePoints = Math.round(totalPoints / students.length);
    
    // العثور على الطلاب المتميزين (النقاط أعلى من 80)
    const excellentStudents = students.filter(student => (student.points || 0) >= 80);
    const excellentCount = excellentStudents.length;
    const excellentPercentage = Math.round((excellentCount / students.length) * 100);
    
    // العثور على الطلاب المحتاجين للدعم (النقاط أقل من 40)
    const needSupportStudents = students.filter(student => (student.points || 0) < 40);
    const needSupportCount = needSupportStudents.length;
    const needSupportPercentage = Math.round((needSupportCount / students.length) * 100);
    
    // عدد المستويات الفريدة
    const uniqueLevelsCount = new Set(students.map(s => s.level)).size;
    
    // عدد المستويات الفريدة
    const uniquePartsCount = new Set(students.map(s => s.parts)).size;
    
    // الطلاب الأعلى والأقل نقاطًا
    const topStudent = [...students].sort((a, b) => (b.points || 0) - (a.points || 0))[0];
    const lowestStudent = [...students].sort((a, b) => (a.points || 0) - (b.points || 0))[0];
    
    return {
      totalStudents: students.length,
      averagePoints,
      excellentCount,
      excellentPercentage,
      needSupportCount,
      needSupportPercentage,
      uniqueLevelsCount,
      uniquePartsCount,
      topStudent,
      lowestStudent
    };
  }, [students]);

  if (!stats) return null;

  return (
    <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        لوحة المعلومات
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* إجمالي الطلاب */}
        <div className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className={`p-3 rounded-lg mr-4 ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <Users className={`h-6 w-6 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>إجمالي الطلاب</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {stats.totalStudents}
            </p>
          </div>
        </div>

        {/* متوسط النقاط */}
        <div className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
          <div className={`p-3 rounded-lg mr-4 ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
            <Activity className={`h-6 w-6 ${isDark ? 'text-green-300' : 'text-green-600'}`} />
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>متوسط النقاط</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              {stats.averagePoints}
            </p>
          </div>
        </div>

        {/* الطلاب المتميزين */}
        <div className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
          <div className={`p-3 rounded-lg mr-4 ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
            <Award className={`h-6 w-6 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} />
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>الطلاب المتميزين</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {stats.excellentCount}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {stats.excellentPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* الطلاب المحتاجين للدعم */}
        <div className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-gray-700' : 'bg-red-50'}`}>
          <div className={`p-3 rounded-lg mr-4 ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
            <TrendingDown className={`h-6 w-6 ${isDark ? 'text-red-300' : 'text-red-600'}`} />
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>بحاجة إلى دعم</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                {stats.needSupportCount}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
              }`}>
                {stats.needSupportPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* إحصائيات إضافية */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            إحصائيات الحلقات والمستويات
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>عدد الحلقات</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.uniqueLevelsCount}
              </p>
            </div>
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>عدد المستويات</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.uniquePartsCount}
              </p>
            </div>
          </div>
        </div>

        {/* الطلاب المميزين */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            أعلى وأقل طالب من حيث النقاط
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>أعلى طالب</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.topStudent?.studentName}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {stats.topStudent?.points} نقطة
              </p>
            </div>
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>أقل طالب</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.lowestStudent?.studentName}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {stats.lowestStudent?.points} نقطة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}