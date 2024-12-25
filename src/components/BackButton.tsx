import React from 'react';
import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 text-brown-600 hover:bg-brown-50 rounded-lg transition-colors"
    >
      <span>←</span>
      <span>رجوع</span>
    </button>
  );
}