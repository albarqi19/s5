import React, { ReactNode } from 'react';
import { useThemeStore } from '../../store/themeStore';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;  // تغيير من string إلى ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  className?: string;
  trend?: number;  // إضافة خاصية trend التي تُستخدم في HomePage
}

const colorClasses = {
  blue: {
    light: 'bg-gradient-to-br from-blue-500 to-blue-600',
    dark: 'bg-gradient-to-br from-blue-600 to-blue-700'
  },
  green: {
    light: 'bg-gradient-to-br from-green-500 to-green-600',
    dark: 'bg-gradient-to-br from-green-600 to-green-700'
  },
  yellow: {
    light: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    dark: 'bg-gradient-to-br from-yellow-600 to-yellow-700'
  },
  red: {
    light: 'bg-gradient-to-br from-red-500 to-red-600',
    dark: 'bg-gradient-to-br from-red-600 to-red-700'
  },
  purple: {
    light: 'bg-gradient-to-br from-purple-500 to-purple-600',
    dark: 'bg-gradient-to-br from-purple-600 to-purple-700'
  }
};

export function StatsCard({ title, value, icon, color = 'blue', className = '', trend }: StatsCardProps) {
  const { isDark } = useThemeStore();
  const colorClass = isDark ? colorClasses[color].dark : colorClasses[color].light;

  return (
    <div 
      className={`rounded-xl p-6 shadow-lg ${colorClass} text-white transform transition-all duration-200 hover:scale-105 hover:shadow-xl ${className}`}
      style={{ direction: 'rtl' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-medium opacity-90">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {trend !== undefined && (
            <div className="mt-2 text-sm flex items-center">
              <span className={trend >= 0 ? 'text-green-300' : 'text-red-300'}>
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
            </div>
          )}
        </div>
        <div className="text-4xl opacity-90 bg-white bg-opacity-20 p-3 rounded-full">{icon}</div>
      </div>
    </div>
  );
}
