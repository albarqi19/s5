import { useState, useCallback } from 'react';

interface UseIterationOptions {
  /**
   * Function to call when continuing the iteration
   */
  onContinue?: () => void;
  
  /**
   * Function to call when canceling the iteration
   */
  onCancel?: () => void;
  
  /**
   * Initial state of the iteration prompt
   */
  initialVisible?: boolean;
}

/**
 * Hook for managing iteration state and functionality
 */
export function useIteration(options: UseIterationOptions = {}) {
  const { onContinue, onCancel, initialVisible = false } = options;
  
  const [isPromptVisible, setPromptVisible] = useState(initialVisible);
  const [iterationCount, setIterationCount] = useState(0);
  
  const showPrompt = useCallback(() => {
    setPromptVisible(true);
  }, []);
  
  const hidePrompt = useCallback(() => {
    setPromptVisible(false);
  }, []);
  
  const handleContinue = useCallback(() => {
    setPromptVisible(false);
    setIterationCount(prev => prev + 1);
    if (onContinue) onContinue();
  }, [onContinue]);
  
  const handleCancel = useCallback(() => {
    setPromptVisible(false);
    if (onCancel) onCancel();
  }, [onCancel]);
  
  return {
    isPromptVisible,
    iterationCount,
    showPrompt,
    hidePrompt,
    handleContinue,
    handleCancel,
  };
}

export default useIteration;