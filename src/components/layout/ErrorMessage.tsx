import React from 'react';
import { AlertTriangle } from '../icons';
import { useThemeStore } from '../../store/themeStore';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const { isDark } = useThemeStore();
  
  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg ${
      isDark 
        ? 'bg-red-900/20 text-red-200' 
        : 'bg-red-50 text-red-600'
    }`}>
      <AlertTriangle className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
}