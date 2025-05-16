
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextIcon, Radio, ToggleLeft, Hash, Edit2, Trash2 } from 'lucide-react';
import { PostCallAnalysisItem } from '@/components/dashboard/sections/agents/types/retell-types';

interface AnalysisItemProps {
  item: PostCallAnalysisItem;
  index: number;
  onEdit: (item: PostCallAnalysisItem, index: number) => void;
  onDelete: (index: number) => void;
}

const AnalysisItem: React.FC<AnalysisItemProps> = ({ item, index, onEdit, onDelete }) => {
  // Get the display type for the UI
  const getTypeIcon = () => {
    switch (item.type) {
      case 'string':
        return <TextIcon className="h-4 w-4 text-blue-500" />;
      case 'boolean':
        return <ToggleLeft className="h-4 w-4 text-green-500" />;
      case 'enum':
        return <Radio className="h-4 w-4 text-purple-500" />;
      case 'number':
        return <Hash className="h-4 w-4 text-amber-500" />;
      default:
        return <TextIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'string':
        return 'Text';
      case 'boolean':
        return 'Yes/No';
      case 'enum':
        return 'Selector';
      case 'number':
        return 'Number';
      default:
        return item.type;
    }
  };

  return (
    <Card className="p-3 border">
      <div className="flex items-start">
        <div className="mr-3 mt-1">{getTypeIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-medium truncate">{item.name}</h4>
              <p className="text-xs text-gray-500 truncate">{item.description}</p>
              
              {/* Show examples or choices based on type */}
              {item.type === 'enum' && item.choices && item.choices.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.choices.map((choice, i) => (
                    <span key={i} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {choice}
                    </span>
                  ))}
                </div>
              )}
              
              {item.type !== 'enum' && item.examples && item.examples.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.examples.map((example, i) => (
                    <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {example}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Type badge */}
              <span className="mt-2 inline-block bg-gray-100 text-gray-800 text-[10px] px-1.5 py-0.5 rounded">
                {getTypeLabel()}
              </span>
            </div>
            
            <div className="flex items-center shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item, index)}
                className="h-7 w-7"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(index)}
                className="h-7 w-7 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnalysisItem;
