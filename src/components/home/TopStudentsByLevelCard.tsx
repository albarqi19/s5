import React, { useState, useMemo } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { Award, Users, ChevronDown, ChevronUp } from '../icons';
import type { Student } from '../../types/student';

interface TopStudentsByLevelCardProps {
  title: string;
  students: Student[];
  icon?: React.ReactNode;
  bgColorClass?: string;
}

export function TopStudentsByLevelCard({ 
  title, 
  students, 
  icon = <Users size={24} />, 
  bgColorClass = '' 
}: TopStudentsByLevelCardProps) {
  const { isDark } = useThemeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // تنظيم الطلاب حسب الحلقات
  const studentsByLevel = useMemo(() => {
    const levels: {[key: string]: Student[]} = {};
    
    // تجميع الطلاب حسب الحلقة
    students.forEach(student => {
      if (!student.level) return;
      
      if (!levels[student.level]) {
        levels[student.level] = [];
      }
      levels[student.level].push(student);
    });
    
    // ترتيب الطلاب داخل كل حلقة حسب النقاط
    Object.keys(levels).forEach(level => {
      levels[level].sort((a, b) => (b.points || 0) - (a.points || 0));
      // اقتصار على العشرة الأوائل فقط
      levels[level] = levels[level].slice(0, 10);
    });
    
    return levels;
  }, [students]);

  // استخراج قائمة بأسماء الحلقات
  const levelNames = useMemo(() => {
    return Object.keys(studentsByLevel);
  }, [studentsByLevel]);

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${bgColorClass || (isDark ? 'bg-gray-800' : 'bg-white')}`}>
      {/* رأس البطاقة */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-5 flex justify-between items-center cursor-pointer ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
      >
        <div className="flex items-center gap-3">
          <span className={`p-2 rounded-full ${isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
            {icon}
          </span>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h3>
        </div>
        <button className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* محتوى البطاقة */}
      {isExpanded && (
        <div className={`p-5 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* قائمة بالحلقات */}
          <div className="flex flex-wrap gap-2 mb-4">
            {levelNames.map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level === selectedLevel ? null : level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  level === selectedLevel
                    ? isDark 
                      ? 'bg-purple-800 text-white' 
                      : 'bg-purple-600 text-white'
                    : isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* جدول الطلاب */}
          {selectedLevel && studentsByLevel[selectedLevel]?.length > 0 ? (
            <div className="overflow-hidden">
              <h4 className={`text-lg font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>                <span className="ml-2">
                  <Award size={18} className="inline" />
                </span>
                العشر الأوائل - {selectedLevel}
              </h4>
              <table className="min-w-full">
                <thead>
                  <tr className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <th className={`px-4 py-3 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>الترتيب</th>
                    <th className={`px-4 py-3 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>اسم الطالب</th>
                    <th className={`px-4 py-3 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>النقاط</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsByLevel[selectedLevel].map((student, index) => (
                    <tr 
                      key={student.id} 
                      className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          {index < 3 ? (
                            <span 
                              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                                index === 0
                                  ? `${isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-600'}`
                                  : index === 1
                                  ? `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                                  : `${isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'}`
                              }`}
                            >
                              {index + 1}
                            </span>
                          ) : (
                            <span className={`px-3 py-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{student.studentName}</td>
                      <td className={`px-4 py-3 text-center`}>
                        <span className={`inline-block px-3 py-1 rounded-full font-medium ${
                          isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'
                        }`}>
                          {student.points || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !selectedLevel ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              الرجاء اختيار حلقة لعرض الطلاب الأوائل
            </div>
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              لا توجد بيانات متاحة لهذه الحلقة
            </div>
          )}
        </div>
      )}
    </div>
  );
}
