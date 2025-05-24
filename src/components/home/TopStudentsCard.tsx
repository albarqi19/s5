import React, { useState } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { Award, ChevronDown, ChevronUp } from '../icons';
import type { Student } from '../../types/student';

interface TopStudentsCardProps {
  title: string;
  students: Student[];
  icon?: React.ReactNode;
  bgColorClass?: string;
}

export function TopStudentsCard({ 
  title, 
  students, 
  icon = <Award size={24} />,
  bgColorClass = ''
}: TopStudentsCardProps) {
  const { isDark } = useThemeStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // تأكد من ترتيب الطلاب تنازلياً حسب النقاط
  const sortedStudents = [...students].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 10);

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${bgColorClass || (isDark ? 'bg-gray-800' : 'bg-white')}`}>
      {/* رأس البطاقة */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-5 flex justify-between items-center cursor-pointer ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
      >
        <div className="flex items-center gap-3">
          <span className={`p-2 rounded-full ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
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
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <th className={`px-4 py-3 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>الترتيب</th>
                  <th className={`px-4 py-3 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>اسم الطالب</th>
                  <th className={`px-4 py-3 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>الحلقة</th>
                  <th className={`px-4 py-3 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>النقاط</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => (
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
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{student.level}</td>
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
        </div>
      )}
    </div>
  );
}
