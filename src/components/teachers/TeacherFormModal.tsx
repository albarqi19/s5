import React, { useState } from 'react';
import { X } from '../icons';
import { Button } from '../ui/Button';
import { useThemeStore } from '../../store/themeStore';

interface TeacherFormModalProps {
  onClose: () => void;
  initialData?: {
    name: string;
    limit: number;
    username: string;
  };
}

export function TeacherFormModal({ onClose, initialData }: TeacherFormModalProps) {
  const { isDark } = useThemeStore();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    limit: initialData?.limit || 0,
    username: initialData?.username || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // سيتم إضافة منطق الحفظ لاحقاً
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`w-full max-w-md mx-4 rounded-xl shadow-xl overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {initialData ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}
          </h2>
          <button
            onClick={onClose}
            className={`text-gray-500 hover:text-gray-700 transition-colors ${
              isDark ? 'hover:text-gray-300' : ''
            }`}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              اسم المعلم
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full rounded-lg border p-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              الحد الأقصى للنقاط
            </label>
            <input
              type="number"
              value={formData.limit}
              onChange={(e) => setFormData(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
              className={`w-full rounded-lg border p-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              اسم المستخدم
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className={`w-full rounded-lg border p-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              type="button"
              variant="danger"
              onClick={onClose}
            >
              إلغاء
            </Button>
            <Button type="submit">
              {initialData ? 'حفظ التغييرات' : 'إضافة المعلم'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}