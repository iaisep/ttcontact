
import React, { useState } from 'react';
import DraggableFormField from './DraggableFormField';

interface FormField {
  key: string;
  type: string;
  required: boolean;
  label: string;
  placeholder: string;
  enabled: boolean;
}

interface DraggableFormFieldsListProps {
  fields: FormField[];
  updatePreFormField: (index: number, field: any) => void;
  onReorderFields: (newOrder: FormField[]) => void;
}

const DraggableFormFieldsList: React.FC<DraggableFormFieldsListProps> = ({
  fields,
  updatePreFormField,
  onReorderFields
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newFields = [...fields];
    const draggedField = newFields[draggedIndex];
    
    // Remove the dragged item
    newFields.splice(draggedIndex, 1);
    
    // Insert it at the new position
    newFields.splice(dropIndex, 0, draggedField);
    
    onReorderFields(newFields);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div>
      <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-700 mb-2">
        <div></div>
        <div>KEY</div>
        <div>TYPE</div>
        <div>REQUIRED</div>
        <div>LABEL</div>
        <div>PLACEHOLDER</div>
      </div>
      
      {fields.map((field, index) => (
        <div
          key={`${field.key}-${index}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`relative ${
            dragOverIndex === index && draggedIndex !== index
              ? 'border-t-2 border-blue-500'
              : ''
          }`}
        >
          <DraggableFormField
            field={field}
            index={index}
            updatePreFormField={updatePreFormField}
            isDragging={draggedIndex === index}
            dragHandleProps={{}}
          />
        </div>
      ))}
    </div>
  );
};

export default DraggableFormFieldsList;
