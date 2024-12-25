import React from 'react';
import { useThemeStore } from '../../stores/theme';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4'
};

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const { isDark } = useThemeStore();
  const spinnerColor = isDark ? 'border-gray-300' : 'border-gray-700';

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} rounded-full ${spinnerColor} border-t-transparent animate-spin`}
        role="status"
        aria-label="جاري التحميل..."
      />
      {message && (
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
