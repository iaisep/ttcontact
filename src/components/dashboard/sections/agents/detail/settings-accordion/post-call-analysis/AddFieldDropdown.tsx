
import React from 'react';
import { Plus, TextIcon, Radio, ToggleLeft, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface AddFieldDropdownProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onSelectField: (type: string) => void;
}

const AddFieldDropdown: React.FC<AddFieldDropdownProps> = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  onSelectField 
}) => {
  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        <DropdownMenuItem onClick={() => onSelectField('text')}>
          <TextIcon className="h-4 w-4 mr-2" />
          <span>Text</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelectField('selector')}>
          <Radio className="h-4 w-4 mr-2" />
          <span>Selector</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelectField('boolean')}>
          <ToggleLeft className="h-4 w-4 mr-2" />
          <span>Boolean</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelectField('number')}>
          <Hash className="h-4 w-4 mr-2" />
          <span>Number</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddFieldDropdown;
