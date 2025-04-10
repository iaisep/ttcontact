
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface WebhookSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const WebhookSearch = ({ searchQuery, onSearchChange }: WebhookSearchProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search webhooks..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
