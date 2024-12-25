import React from 'react';
import { Edit, Trash2 } from '../icons';

export function StudentActions() {
  return (
    <div className="flex gap-2">
      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
        <Edit size={16} />
      </button>
      <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
        <Trash2 size={16} />
      </button>
    </div>
  );
}