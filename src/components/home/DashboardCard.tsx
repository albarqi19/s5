import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

interface DashboardCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function DashboardCard({ to, icon, title, description, className = '' }: DashboardCardProps) {
  const { isDark } = useThemeStore();
  
  return (
    <Link 
      to={to}
      className={`block p-6 rounded-2xl transition-all duration-300 ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        {icon}
        
        {/* Content */}
        <div className="mt-6">
          <h3 className={`text-xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            {title}
          </h3>
          <p className={`${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}