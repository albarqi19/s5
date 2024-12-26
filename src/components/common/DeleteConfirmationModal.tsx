import React, { useState } from 'react';
import { useThemeStore } from '../../store/themeStore';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmationModalProps) {
  const { isDark } = useThemeStore();
  const [confirmText, setConfirmText] = useState('');
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

  const handleFirstConfirm = () => {
    setShowFinalConfirmation(true);
  };

  const handleFinalConfirm = () => {
    if (confirmText.toLowerCase() === 'حذف') {
      onConfirm();
      onClose();
      setShowFinalConfirmation(false);
      setConfirmText('');
    }
  };

  const handleClose = () => {
    onClose();
    setShowFinalConfirmation(false);
    setConfirmText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          تأكيد الحذف
        </h3>
        
        {!showFinalConfirmation ? (
          <>
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              هل أنت متأكد من حذف {itemName}؟
            </p>
            <div className="flex justify-end space-x-2 space-x-reverse">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleFirstConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                نعم، متابعة
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              للتأكيد النهائي، اكتب كلمة "حذف" في المربع أدناه
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`w-full p-2 mb-4 border rounded-md ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder='اكتب "حذف"'
              dir="rtl"
            />
            <div className="flex justify-end space-x-2 space-x-reverse">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleFinalConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  confirmText.toLowerCase() === 'حذف'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={confirmText.toLowerCase() !== 'حذف'}
              >
                تأكيد الحذف
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
