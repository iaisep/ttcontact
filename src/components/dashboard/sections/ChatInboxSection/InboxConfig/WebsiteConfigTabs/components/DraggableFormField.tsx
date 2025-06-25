
import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { GripVertical } from 'lucide-react';

interface FormField {
  key: string;
  type: string;
  required: boolean;
  label: string;
  placeholder: string;
  enabled: boolean;
}

interface DraggableFormFieldProps {
  field: FormField;
  index: number;
  updatePreFormField: (index: number, field: any) => void;
  isDragging: boolean;
  dragHandleProps: any;
}

const DraggableFormField: React.FC<DraggableFormFieldProps> = ({
  field,
  index,
  updatePreFormField,
  isDragging,
  dragHandleProps
}) => {
  return (
    <div 
      className={`grid grid-cols-6 gap-2 items-center py-2 border-b transition-all ${
        isDragging ? 'opacity-50 scale-95 bg-gray-50 dark:bg-gray-800' : ''
      }`}
    >
      <div className="flex items-center justify-center">
        <div 
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={field.enabled}
          onCheckedChange={(checked) => updatePreFormField(index, { enabled: checked })}
        />
        <span className="text-sm">{field.key}</span>
      </div>
      <div className="text-sm">{field.type}</div>
      <div className="flex justify-center">
        <Switch
          checked={field.required}
          onCheckedChange={(checked) => updatePreFormField(index, { required: checked })}
        />
      </div>
      <div>
        <Input
          value={field.label}
          onChange={(e) => updatePreFormField(index, { label: e.target.value })}
          className="text-sm"
        />
      </div>
      <div>
        <Input
          value={field.placeholder}
          onChange={(e) => updatePreFormField(index, { placeholder: e.target.value })}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default DraggableFormField;
