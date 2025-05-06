import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import { Award } from 'lucide-react';
import type { Student } from '../../types/student';

interface CertificateCardProps {
  student: Student;
  onClick: () => void;
}

export function CertificateCard({ student, onClick }: CertificateCardProps) {
  const { isDark } = useThemeStore();
  
  const getPointsColor = () => {
    if (student.points >= 90) return 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900';
    if (student.points >= 80) return 'bg-gradient-to-r from-green-300 to-green-500 text-green-900';
    if (student.points >= 70) return 'bg-gradient-to-r from-blue-300 to-blue-500 text-blue-900';
    return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900';
  };
  
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{student.studentName}</h3>
        <div className={`p-2 rounded-full ${
          isDark ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-100 text-blue-700'
        }`}>
          <Award size={20} />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>الحلقة:</span>
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{student.level}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>المستوى:</span>
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{student.parts}</span>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <div className={`px-4 py-2 rounded-full text-center font-bold ${getPointsColor()}`}>
          {student.points} نقطة
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isDark ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900' 
                : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800'
        } transition-colors shadow-md`}>
          <Award size={18} />
          عرض الشهادة
        </button>
      </div>
    </div>
  );
}
