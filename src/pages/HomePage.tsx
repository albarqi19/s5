import React, { useMemo } from 'react';
import { useApi } from '../hooks/api/useApi';
import { StatsCard } from '../components/dashboard/StatsCard';
import { AdvancedStats } from '../components/dashboard/AdvancedStats';
import type { Student } from '../types/student';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Users, ClipboardList, GraduationCap, AlertTriangle, Award } from '../components/icons';
import { PageLayout } from '../components/layout/PageLayout';
import { DashboardCard } from '../components/home/DashboardCard';
import { useThemeStore } from '../store/themeStore';

export function HomePage() {
  const { isDark } = useThemeStore();
  const { data: studentsData, loading, error } = useApi<Student[]>('students');

  const stats = useMemo(() => {
    if (!studentsData) return null;

    const totalStudents = studentsData.length;
    
    // حساب متوسط النقاط
    const totalPoints = studentsData.reduce((sum: number, student: Student) => sum + (student.points || 0), 0);
    const averagePoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;
    
    // حساب عدد الحلقات الفريدة
    const uniqueLevels = new Set(studentsData.map((student: Student) => student.level)).size;
    
    // حساب عدد الطلاب المتميزين (النقاط أعلى من 80)
    const excellentStudents = studentsData.filter((student: Student) => (student.points || 0) > 80).length;

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
          
          <div className="relative p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">مرحباً بك  في لوحة تحكم برنامج نـافــس</h1>
            <p className="mb-6 opacity-90">اطلع على آخر إحصائيات الطلاب والحلقات</p>
            
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                  title="إجمالي الطلاب"
                  value={stats.totalStudents}
                  icon={<Users className="h-8 w-8" />}
                  trend={5}
                />
                
                <StatsCard 
                  title="متوسط النقاط"
                  value={stats.averagePoints}
                  icon={<ClipboardList className="h-8 w-8" />}
                  trend={2}
                />
                
                <StatsCard 
                  title="عدد الحلقات"
                  value={stats.uniqueLevels}
                  icon={<GraduationCap className="h-8 w-8" />}
                  trend={0}
                />
                
                <StatsCard 
                  title="الطلاب المتميزون"
                  value={stats.excellentStudents}
                  icon={<Award className="h-8 w-8" />}
                  trend={8}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Advanced Stats Section */}
        {stats && studentsData && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">التحليلات والإحصائيات المتقدمة</h2>
            <AdvancedStats studentsData={studentsData} />
          </div>
        )}
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="إدارة الطلاب" 
            icon={<Users className="h-6 w-6" />}
            description="إضافة وتعديل بيانات الطلاب ومتابعة أدائهم"
            to="/students"
            className={`${isDark ? 'bg-blue-900/40 hover:bg-blue-900/60' : 'bg-blue-50 hover:bg-blue-100'} shadow-lg hover:shadow-xl`}
          />
          
          <DashboardCard 
            title="إدارة المعلمين" 
            icon={<GraduationCap className="h-6 w-6" />}
            description="إدارة المعلمين وتعيين الحلقات والصلاحيات"
            to="/teachers"
            className={`${isDark ? 'bg-green-900/40 hover:bg-green-900/60' : 'bg-green-50 hover:bg-green-100'} shadow-lg hover:shadow-xl`}
          />
          
          <DashboardCard 
            title="سجلات النقاط" 
            icon={<ClipboardList className="h-6 w-6" />}
            description="متابعة نقاط الطلاب"
            to="/records"
            className={`${isDark ? 'bg-purple-900/40 hover:bg-purple-900/60' : 'bg-purple-50 hover:bg-purple-100'} shadow-lg hover:shadow-xl`}
          />

          <DashboardCard 
            title="شهادات التميز" 
            icon={<Award className="h-6 w-6" />}
            description="إنشاء وطباعة شهادات للطلاب المتميزين"
            to="/certificates"
            className={`${isDark ? 'bg-yellow-900/40 hover:bg-yellow-900/60' : 'bg-yellow-50 hover:bg-yellow-100'} shadow-lg hover:shadow-xl`}
          />
          
          <DashboardCard 
            title="إنذارات الطلاب" 
            icon={<AlertTriangle className="h-6 w-6" />}
            description="متابعة المخالفات والإنذارات للطلاب"
            to="/students"
            badge={studentsData ? studentsData.filter(s => s.violations?.length > 0).length : 0}
            className={`${isDark ? 'bg-red-900/40 hover:bg-red-900/60' : 'bg-red-50 hover:bg-red-100'} shadow-lg hover:shadow-xl`}
          />
        </div>
      </div>
    </PageLayout>
  );
}