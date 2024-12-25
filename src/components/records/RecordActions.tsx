import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface RecordActionsProps {
  row: {
    original: {
      id: string;
    };
  };
}

export function RecordActions({ row }: RecordActionsProps) {
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