
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';

interface UrlSourceInputViewProps {
  sourceUrl: string;
  autoSync: boolean;
  loading: boolean;
  onSourceUrlChange: (url: string) => void;
  onAutoSyncChange: (checked: boolean) => void;
  onFetchSitemap: () => void;
}

const UrlSourceInputView: React.FC<UrlSourceInputViewProps> = ({
  sourceUrl,
  autoSync,
  loading,
  onSourceUrlChange,
  onAutoSyncChange,
  onFetchSitemap
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="url">Website URL</Label>
        <div className="flex gap-2">
          <Input
            id="url"
            placeholder="https://example.com"
            value={sourceUrl}
            onChange={(e) => onSourceUrlChange(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="button"
            onClick={onFetchSitemap}
            disabled={!sourceUrl || loading}
          >
            <Search className="h-4 w-4 mr-1" /> Scan
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter the root URL of the website to scan its sitemap.
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="auto-sync" 
          checked={autoSync}
          onCheckedChange={(checked) => onAutoSyncChange(checked === true)}
        />
        <Label htmlFor="auto-sync" className="text-sm cursor-pointer">
          Auto sync web pages every 24 hours
        </Label>
      </div>
    </div>
  );
};

export default UrlSourceInputView;
