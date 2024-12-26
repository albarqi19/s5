import React, { useMemo } from 'react';
import { useApi } from '../hooks/api/useApi';
import { StatsCard } from '../components/dashboard/StatsCard';
import type { Student } from '../types/student';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Users, ClipboardList, GraduationCap, Plus, AlertTriangle } from '../components/icons';
import { ThemeToggle } from '../components/ThemeToggle';
import { PageLayout } from '../components/layout/PageLayout';
import { DashboardCard } from '../components/home/DashboardCard';
import { useThemeStore } from '../store/themeStore';

export function HomePage() {
  const { isDark } = useThemeStore();
  const { data: studentsData, loading, error } = useApi<Student>('students');

  const stats = useMemo(() => {
    if (!studentsData) return null;

    const totalStudents = studentsData.length;
    
    // حساب متوسط النقاط
    const totalPoints = studentsData.reduce((sum, student) => sum + (student.points || 0), 0);
    const averagePoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;
    
    // حساب عدد الحلقات الفريدة
    const uniqueLevels = new Set(studentsData.map(student => student.level)).size;
    
    // حساب عدد الطلاب المتميزين (النقاط أعلى من 80)
    const excellentStudents = studentsData.filter(student => (student.points || 0) > 80).length;

    return {
      totalStudents,
      averagePoints,
      uniqueLevels,
      excellentStudents
    };
  }, [studentsData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>حدث خطأ في تحميل البيانات</p>
      </div>
    );
  }

  return (
    <PageLayout showBackButton={false}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className={`relative overflow-hidden mb-12 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute transform -rotate-45 -right-32 -top-32 w-96 h-96 bg-white rounded-full"></div>
            <div className="absolute transform -rotate-45 -left-32 -bottom-32 w-96 h-96 bg-white rounded-full"></div>
          </div>
          <div className="relative px-6 py-12 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">لوحة تحكم برنامج نــافـس</h1>
            <p className="text-lg md:text-xl opacity-90">نظام إدارة وتتبع تقدم الطلاب</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="إجمالي الطلاب"
            value={stats?.totalStudents || 0}
            icon="👥"
            color="blue"
            className="transform hover:scale-105 transition-all duration-300"
          />
          
          <StatsCard
            title="متوسط النقاط"
            value={stats?.averagePoints || 0}
            icon="⭐"
            color="yellow"
            className="transform hover:scale-105 transition-all duration-300"
          />
          
          <StatsCard
            title="عدد الحلقات"
            value={stats?.uniqueLevels || 0}
            icon="📚"
            color="green"
            className="transform hover:scale-105 transition-all duration-300"
          />

          <StatsCard
            title="الطلاب المتميزون"
            value={stats?.excellentStudents || 0}
            icon="🏆"
            color="purple"
            className="transform hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <DashboardCard
            to="/students"
            icon={
              <div className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                <Users className="w-10 h-10" />
              </div>
            }
            title="بيانات الطلاب"
            description="عرض وإدارة بيانات الطلاب"
            className={`group overflow-hidden relative transform hover:-translate-y-1 transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/50 hover:bg-gray-800' 
                : 'bg-white hover:shadow-lg hover:bg-blue-50/30'
            }`}
          />
          
          <DashboardCard
            to="/records"
            icon={
              <div className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                <ClipboardList className="w-10 h-10" />
              </div>
            }
            title="سجل النقاط"
            description="عرض وإدارة سجل النقاط"
            className={`group overflow-hidden relative transform hover:-translate-y-1 transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/50 hover:bg-gray-800' 
                : 'bg-white hover:shadow-lg hover:bg-emerald-50/30'
            }`}
          />
          
          <DashboardCard
            to="/teachers"
            icon={
              <div className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-600/10 ${
                isDark ? 'text-violet-400' : 'text-violet-600'
              }`}>
                <GraduationCap className="w-10 h-10" />
              </div>
            }
            title="المعلمين"
            description="عرض وإدارة بيانات المعلمين"
            className={`group overflow-hidden relative transform hover:-translate-y-1 transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/50 hover:bg-gray-800' 
                : 'bg-white hover:shadow-lg hover:bg-violet-50/30'
            }`}
          />
        </div>

        {/* Additional Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a 
            href="https://www.appsheet.com/start/d2527eab-ea7a-4fc7-89af-170b71cd850d#appName=%D8%A7%D8%AF%D8%A7%D8%B1%D8%A9%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-976645-24-12-26&row=&table=Record+Data&view=%D8%A7%D8%B6%D8%A7%D9%81%D8%A9+%D8%A7%D9%84%D9%86%D9%82%D8%A7%D8%B7"
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-6 rounded-2xl transition-all duration-300 group overflow-hidden relative transform hover:-translate-y-1 ${
              isDark 
                ? 'bg-gray-800/50 hover:bg-gray-800' 
                : 'bg-white hover:shadow-lg hover:bg-amber-50/30'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}>
                <Plus className="w-10 h-10" />
              </div>
              <div className="mt-6">
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  اضافة نقاط
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  إضافة نقاط جديدة للطلاب
                </p>
              </div>
            </div>
          </a>

          <a 
            href="https://www.appsheet.com/start/d2527eab-ea7a-4fc7-89af-170b71cd850d#appName=%D8%A7%D8%AF%D8%A7%D8%B1%D8%A9%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-976645-24-12-26&group=%5B%5D&sort=%5B%5D&table=%D8%A7%D9%84%D9%85%D8%AE%D8%A7%D9%84%D9%81%D8%A7%D8%AA&view=%D8%A7%D9%84%D9%85%D8%AE%D8%A7%D9%84%D9%81%D8%A7%D8%AA"
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-6 rounded-2xl transition-all duration-300 group overflow-hidden relative transform hover:-translate-y-1 ${
              isDark 
                ? 'bg-gray-800/50 hover:bg-gray-800' 
                : 'bg-white hover:shadow-lg hover:bg-red-50/30'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/10 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="mt-6">
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  اضافة مخالفات
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  تسجيل المخالفات للطلاب
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </PageLayout>
  );
}