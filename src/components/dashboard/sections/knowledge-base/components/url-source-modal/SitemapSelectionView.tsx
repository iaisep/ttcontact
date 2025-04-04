
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { WebPage } from '../../types';

interface SitemapSelectionViewProps {
  webPages: WebPage[];
  selectedPageUrls: string[];
  onSelectionToggle: (pageUrl: string) => void;
  onToggleAll: () => void;
  isLoading: boolean;
  autoSync: boolean;
  setAutoSync: (checked: boolean) => void;
}

const SitemapSelectionView: React.FC<SitemapSelectionViewProps> = ({
  webPages,
  selectedPageUrls,
  onSelectionToggle,
  onToggleAll,
  isLoading,
  autoSync,
  setAutoSync
}) => {
  const allSelected = webPages.length > 0 && selectedPageUrls.length === webPages.length;

  return (
    <div className="space-y-4">
      <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
        {webPages.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No pages found in the sitemap.
          </div>
        ) : (
          webPages.map((page) => (
            <div 
              key={page.url}
              className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectionToggle(page.url)}
            >
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={selectedPageUrls.includes(page.url)}
                  onCheckedChange={() => onSelectionToggle(page.url)}
                  id={`page-${page.url}`}
                />
                <Label 
                  htmlFor={`page-${page.url}`}
                  className="text-sm cursor-pointer"
                >
                  {page.title || page.url}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {page.url}
              </span>
            </div>
          ))
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {selectedPageUrls.length} of {webPages.length} pages selected
        </div>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onToggleAll}
            disabled={webPages.length === 0}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="sitemap-auto-sync" 
          checked={autoSync}
          onCheckedChange={(checked) => setAutoSync(checked === true)}
        />
        <Label htmlFor="sitemap-auto-sync" className="text-sm cursor-pointer">
          Auto sync web pages every 24 hours
        </Label>
      </div>
    </div>
  );
};

export default SitemapSelectionView;
