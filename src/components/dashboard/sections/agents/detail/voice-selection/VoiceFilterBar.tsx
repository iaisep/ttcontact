
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
import { Plus, Search } from 'lucide-react';

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
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <Button variant="outline" className="h-9 gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
        <Plus className="h-4 w-4" />
        Add custom voice
      </Button>
      
      <div className="flex-1 flex flex-wrap gap-3">
        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="w-28 h-9 bg-white border-gray-200">
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
          <SelectTrigger className="w-28 h-9 bg-white border-gray-200">
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
          <SelectTrigger className="w-28 h-9 bg-white border-gray-200">
            <SelectValue placeholder="Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_types">All Types</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 border-gray-200 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceFilterBar;
