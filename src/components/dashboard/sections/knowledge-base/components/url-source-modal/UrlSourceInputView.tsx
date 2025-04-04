
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';

interface UrlSourceInputViewProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  onSubmit: () => Promise<void>;
}

const UrlSourceInputView: React.FC<UrlSourceInputViewProps> = ({
  url,
  setUrl,
  isLoading,
  onSubmit
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="url">Website URL</Label>
        <div className="flex gap-2">
          <Input
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="button"
            onClick={onSubmit}
            disabled={!url || isLoading}
          >
            <Search className="h-4 w-4 mr-1" /> Scan
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter the root URL of the website to scan its sitemap.
        </p>
      </div>
    </div>
  );
};

export default UrlSourceInputView;
