import React, { useMemo } from 'react';
import { useCachedData } from '../../hooks/useCachedData';
import { useThemeStore } from '../../store/themeStore';
import { ChevronUp, ChevronDown, TrendingUp, Activity, Users, Award, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import type { Student } from '../../types/student';
import type { Record } from '../../types/record';

interface AdvancedStatsProps {
  studentsData: Student[] | null | undefined;
}

export function AdvancedStats({ studentsData }: AdvancedStatsProps) {
  const { isDark } = useThemeStore();
  const { data: records = [], loading: loadingRecords } = useCachedData<Record[]>('records');
  
  // استخدام البيانات المرسلة مباشرة من المكون الأب بدلاً من جلبها مرة أخرى
  const students = studentsData || [];
  
  // حساب الإحصائيات
  const stats = useMemo(() => {
    if (!students || students.length === 0) return null;
    
    // إحصائيات عامة
    const totalStudents = students.length;
    const totalPoints = students.reduce((sum, student) => sum + (student.points || 0), 0);
    const averagePoints = totalStudents ? Math.round(totalPoints / totalStudents) : 0;
    
    // تصنيف الطلاب حسب النقاط
    const excellentStudents = students.filter(student => (student.points || 0) >= 80);
    const goodStudents = students.filter(student => (student.points || 0) >= 60 && (student.points || 0) < 80);
    const averageStudents = students.filter(student => (student.points || 0) >= 40 && (student.points || 0) < 60);
    const belowAverageStudents = students.filter(student => (student.points || 0) < 40);

    // تحليل حسب الحلقات
    const levelsSet = new Set();
    students.forEach(student => {
      if (student.level) levelsSet.add(student.level);
    });
    const circles = Array.from(levelsSet);
    
    const circleStats = circles.map(circle => {
      const circleStudents = students.filter(student => student.level === circle);
      const circleStudentsCount = circleStudents.length;
      const circlePoints = circleStudents.reduce((sum, student) => sum + (student.points || 0), 0);
      const circleAverage = circleStudentsCount > 0 ? Math.round(circlePoints / circleStudentsCount) : 0;
      return {
        name: circle,
        studentCount: circleStudentsCount,
        averagePoints: circleAverage,
        excellent: circleStudents.filter(student => (student.points || 0) >= 80).length
      };
    }).sort((a, b) => b.averagePoints - a.averagePoints);

    // حساب الاتجاهات من السجلات الأخيرة (السجلات مرتبة من الأحدث إلى الأقدم)
    let trend = 0;
    let recentActivities = 0;
    
    if (records && records.length > 0) {
      // حساب سجلات الشهر الحالي
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentMonthRecords = records.filter(record => {
        if (!record.date) return false;
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      });
      
      recentActivities = currentMonthRecords.length;
      
      // حساب الاتجاه العام للنقاط (هل هي في زيادة أم نقصان)
      if (records.length >= 10) {
        const recentRecords = records.slice(0, 10);
        const olderRecords = records.slice(records.length - 10);
        
        const recentPointsAvg = recentRecords.reduce((sum, record) => sum + (record.points || 0), 0) / recentRecords.length;
        const olderPointsAvg = olderRecords.reduce((sum, record) => sum + (record.points || 0), 0) / olderRecords.length;
        
        trend = recentPointsAvg - olderPointsAvg;
      }
    }

    return {
      totalStudents,
      totalPoints,
      averagePoints,
      excellentCount: excellentStudents.length,
      goodCount: goodStudents.length,
      averageCount: averageStudents.length,
      belowAverageCount: belowAverageStudents.length,
      circleStats,
      trend,
      recentActivities
    };
  }, [students, records]);

  if (loadingRecords) {
    return (
      <div className={`w-full p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`w-full p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex justify-center items-center flex-col p-6">
          <AlertTriangle className={`h-12 w-12 mb-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>لا توجد بيانات كافية لعرض الإحصائيات</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        تحليل البيانات المتقدم
      </h2>
      
      {/* المؤشرات الرئيسية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي الطلاب</p>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalStudents}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-blue-100'}`}>
              <Users className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-800'}`} />
            </div>
          </div>
          <div className={`mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {stats.trend > 0 ? (
              <div className="flex items-center text-green-500">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>في تزايد</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400">
                <Activity className="h-4 w-4 mr-1" />
                <span>مستقر</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>متوسط النقاط</p>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.averagePoints}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-green-100'}`}>
              <Award className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-800'}`} />
            </div>
          </div>
          <div className={`mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {stats.trend > 0 ? (
              <div className="flex items-center text-green-500">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>تحسن {Math.abs(Math.round(stats.trend))} نقطة</span>
              </div>
            ) : stats.trend < 0 ? (
              <div className="flex items-center text-red-500">
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>انخفاض {Math.abs(Math.round(stats.trend))} نقطة</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400">
                <Activity className="h-4 w-4 mr-1" />
                <span>مستقر</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>طلاب متميزون</p>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.excellentCount} <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>({Math.round(stats.excellentCount / stats.totalStudents * 100)}%)</span>
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-yellow-100'}`}>
              <TrendingUp className={`h-5 w-5 ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`} />
            </div>
          </div>
          <div className={`mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              <span>أعلى من 80 نقطة</span>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>نشاطات حديثة</p>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.recentActivities}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-purple-100'}`}>
              <Activity className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-800'}`} />
            </div>
          </div>
          <div className={`mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              <span>خلال الشهر الحالي</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* مستويات تقدم الطلاب */}
      <div className="mb-8">
        <h3 className={`font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>تصنيف الطلاب حسب المستوى</h3>
        <div className="h-4 rounded-full overflow-hidden flex">
          <div className="bg-green-500" style={{ width: `${stats.totalStudents > 0 ? (stats.excellentCount / stats.totalStudents * 100) : 0}%` }}></div>
          <div className="bg-blue-500" style={{ width: `${stats.totalStudents > 0 ? (stats.goodCount / stats.totalStudents * 100) : 0}%` }}></div>
          <div className="bg-yellow-500" style={{ width: `${stats.totalStudents > 0 ? (stats.averageCount / stats.totalStudents * 100) : 0}%` }}></div>
          <div className="bg-red-500" style={{ width: `${stats.totalStudents > 0 ? (stats.belowAverageCount / stats.totalStudents * 100) : 0}%` }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>متميز ({stats.totalStudents > 0 ? Math.round(stats.excellentCount / stats.totalStudents * 100) : 0}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>جيد ({stats.totalStudents > 0 ? Math.round(stats.goodCount / stats.totalStudents * 100) : 0}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>متوسط ({stats.totalStudents > 0 ? Math.round(stats.averageCount / stats.totalStudents * 100) : 0}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>بحاجة إلى تحسين ({stats.totalStudents > 0 ? Math.round(stats.belowAverageCount / stats.totalStudents * 100) : 0}%)</span>
          </div>
        </div>
      </div>
      
      {/* إحصائيات الحلقات */}
      <div>
        <h3 className={`font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>أداء الحلقات</h3>
        <div className={`overflow-hidden rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-300">
                  الحلقة
                </th>
                <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-300">
                  عدد الطلاب
                </th>
                <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-300">
                  متوسط النقاط
                </th>
                <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-gray-500 dark:text-gray-300">
                  متميزون
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {stats.circleStats && stats.circleStats.map((circle, index) => (
                <tr key={index} className={isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{circle.name || 'غير محدد'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{circle.studentCount}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPointsColor(circle.averagePoints, isDark)}`}>
                        {circle.averagePoints}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {circle.excellent} ({circle.studentCount > 0 ? Math.round(circle.excellent / circle.studentCount * 100) : 0}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// دالة مساعدة لتحديد لون النقاط
function getPointsColor(points: number, isDark: boolean) {
  if (points >= 80) {
    return isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800';
  } else if (points >= 60) {
    return isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800';
  } else if (points >= 40) {
    return isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
  } else {
    return isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800';
  }
}