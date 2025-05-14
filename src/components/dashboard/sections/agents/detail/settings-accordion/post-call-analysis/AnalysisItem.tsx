
import React from 'react';
import { TextIcon, Radio, ToggleLeft, Hash, Edit, Trash } from 'lucide-react';
import { PostCallAnalysisItem } from '@/components/dashboard/sections/agents/types/retell-types';

interface AnalysisItemProps {
  item: PostCallAnalysisItem;
  index: number;
  onEdit: (item: PostCallAnalysisItem, index: number) => void;
  onDelete: (index: number) => void;
}

const AnalysisItem: React.FC<AnalysisItemProps> = ({ item, index, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
      <div className="flex items-center">
        {item.type === 'text' && <TextIcon className="h-4 w-4 mr-2 text-gray-500" />}
        {item.type === 'selector' && <Radio className="h-4 w-4 mr-2 text-gray-500" />}
        {item.type === 'boolean' && <ToggleLeft className="h-4 w-4 mr-2 text-gray-500" />}
        {item.type === 'number' && <Hash className="h-4 w-4 mr-2 text-gray-500" />}
        <span className="text-sm">{item.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={() => onEdit(item, index)}
        >
          <Edit className="h-4 w-4" />
        </button>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={() => onDelete(index)}
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AnalysisItem;
