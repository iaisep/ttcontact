
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FunctionFormErrors } from '../../types';

interface BasicInfoSectionProps {
  name: string;
  description: string;
  errors: FunctionFormErrors;
  onChange: (field: string, value: any) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  description,
  errors,
  onChange
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          className="col-span-3"
          placeholder="function_name"
        />
        {errors.name && <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.name}</p>}
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
          className="col-span-3"
          placeholder="Brief description of what this function does"
        />
        {errors.description && <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.description}</p>}
      </div>
    </>
  );
};

export default BasicInfoSection;
