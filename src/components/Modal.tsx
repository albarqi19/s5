import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    // إذا كان النقر على الخلفية نفسها وليس على المحتوى
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
}
