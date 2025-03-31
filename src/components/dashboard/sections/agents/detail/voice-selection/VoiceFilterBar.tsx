
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface VoiceFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  genderFilter: string;
  setGenderFilter: (filter: string) => void;
  accentFilter: string;
  setAccentFilter: (filter: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
}

const VoiceFilterBar: React.FC<VoiceFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  genderFilter,
  setGenderFilter,
  accentFilter,
  setAccentFilter,
  typeFilter,
  setTypeFilter
}) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Button variant="outline" className="gap-2 bg-gray-100">
        <Plus className="h-4 w-4" />
        Add custom voice
      </Button>
      
      <Select value={genderFilter} onValueChange={setGenderFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all_genders">All Genders</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="neutral">Neutral</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={accentFilter} onValueChange={setAccentFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Accent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all_accents">All Accents</SelectItem>
          <SelectItem value="american">American</SelectItem>
          <SelectItem value="british">British</SelectItem>
          <SelectItem value="indian">Indian</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all_types">All Types</SelectItem>
          <SelectItem value="retail">Retail</SelectItem>
          <SelectItem value="provider">Provider</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex-1">
        <Input 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default VoiceFilterBar;
