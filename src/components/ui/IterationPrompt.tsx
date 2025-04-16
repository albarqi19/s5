import React from 'react';

interface IterationPromptProps {
  isVisible: boolean;
  onContinue: () => void;
  onCancel: () => void;
  message: string;
  continueText?: string;
  cancelText?: string;
}

/**
 * IterationPrompt - A component that prompts the user if they want to continue iterating
 * through a process or action.
 */
export const IterationPrompt: React.FC<IterationPromptProps> = ({
  isVisible,
  onContinue,
  onCancel,
  message,
  continueText = "نعم، استمر",
  cancelText = "لا، إغلاق"
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm mx-auto shadow-xl transform transition-all duration-200 scale-100">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {message}
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
          <button
            onClick={onCancel}
            className="order-2 sm:order-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onContinue}
            className="order-1 sm:order-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            autoFocus
          >
            {continueText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IterationPrompt;