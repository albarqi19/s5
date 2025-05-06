import React from 'react';
import { useToastStore, type Toast } from '../../store/toastStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function GlobalToast() {
  const { toasts, removeToast } = useToastStore();
  
  if (toasts.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800',
          icon: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
          title: 'text-green-800 dark:text-green-300',
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 dark:bg-red-900/50 dark:border-red-800',
          icon: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
          title: 'text-red-800 dark:text-red-300',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/50 dark:border-yellow-800',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
          title: 'text-yellow-800 dark:text-yellow-300',
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/50 dark:border-blue-800',
          icon: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
          title: 'text-blue-800 dark:text-blue-300',
        };
    }
  };
  
  const styles = getToastStyles();
  
  return (
    <div 
      className={`p-4 rounded-lg border shadow-lg transform transition-all duration-500 animate-slide-in flex items-center justify-between ${styles.container}`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 ms-3 ms-0 me-3">
          {styles.icon}
        </div>
        <div className="ms-3 me-2 flex-grow">
          <p className={`text-sm font-medium ${styles.title}`}>{toast.message}</p>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 ms-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        aria-label="إغلاق"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}