import React from 'react';
import { Edit, Trash2, Phone, Sparkles, Calendar, FileText } from 'lucide-react';
import { AgentFunction, FunctionItemProps } from './types';

export const FunctionItem: React.FC<FunctionItemProps> = ({ func, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
      <div className="flex items-center">
        {getFunctionIcon(func)}
        <span className="text-sm">{func.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={() => onEdit(func)}
        >
          <Edit className="h-4 w-4" />
        </button>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={() => onDelete(func)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Helper function to get the appropriate icon for a function
export const getFunctionIcon = (func: AgentFunction) => {
  switch (func.type) {
    case 'end_call':
      return <Phone className="h-4 w-4 mr-2 text-gray-500" />;
    case 'custom':
      return <Sparkles className="h-4 w-4 mr-2 text-amber-500" />;
    case 'calendar':
      return <Calendar className="h-4 w-4 mr-2 text-blue-500" />;
    default:
      return <FileText className="h-4 w-4 mr-2 text-gray-500" />;
  }
};
