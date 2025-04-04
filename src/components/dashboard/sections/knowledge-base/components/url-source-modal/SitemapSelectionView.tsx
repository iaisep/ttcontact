
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { WebPage } from '../../types';
import { Globe, Check } from 'lucide-react';

interface SitemapSelectionViewProps {
  webPages: WebPage[];
  selectedPageUrls: string[];
  onSelectionToggle: (pageUrl: string) => void;
  onToggleAll: () => void;
  isLoading: boolean;
  autoSync: boolean;
  setAutoSync: (checked: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const SitemapSelectionView: React.FC<SitemapSelectionViewProps> = ({
  webPages,
  selectedPageUrls,
  onSelectionToggle,
  onToggleAll,
  isLoading,
  autoSync,
  setAutoSync,
  onCancel,
  onConfirm
}) => {
  const groupedPages = webPages.reduce((acc, page) => {
    const domain = new URL(page.url).hostname;
    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(page);
    return acc;
  }, {} as Record<string, WebPage[]>);

  const allSelected = selectedPageUrls.length === webPages.length;
  const someSelected = selectedPageUrls.length > 0 && selectedPageUrls.length < webPages.length;

  return (
    <div className="space-y-4">
      {/* Header with select all checkbox */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="select-all" 
            checked={allSelected || someSelected}
            onCheckedChange={() => onToggleAll()}
          />
          <label 
            htmlFor="select-all" 
            className="text-sm font-medium cursor-pointer"
          >
            {allSelected ? 'Deselect All' : 'Select All'} ({webPages.length} pages)
          </label>
        </div>
        <div className="text-sm text-gray-500">
          {selectedPageUrls.length} selected
        </div>
      </div>
      
      {/* List of domains and their pages */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {Object.entries(groupedPages).map(([domain, pages]) => (
          <div key={domain} className="space-y-2">
            <h3 className="text-sm font-medium">{domain}</h3>
            <div className="space-y-1">
              {pages.map((page) => (
                <div 
                  key={page.url} 
                  className={`
                    flex items-center p-2 rounded-md 
                    ${selectedPageUrls.includes(page.url) ? 'bg-gray-100' : 'hover:bg-gray-50'}
                  `}
                >
                  <Checkbox 
                    id={`page-${page.url}`}
                    checked={selectedPageUrls.includes(page.url)}
                    onCheckedChange={() => onSelectionToggle(page.url)}
                    className="mr-2"
                  />
                  <label 
                    htmlFor={`page-${page.url}`}
                    className="flex flex-1 cursor-pointer items-center"
                  >
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      <div className="text-sm truncate max-w-[380px]" title={page.url}>
                        {page.title || page.url}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Auto-sync option */}
      <div className="flex items-center space-x-2 pt-3 border-t">
        <Checkbox 
          id="auto-sync"
          checked={autoSync}
          onCheckedChange={(checked) => setAutoSync(checked === true)}
        />
        <label htmlFor="auto-sync" className="text-sm cursor-pointer">
          Auto sync web pages every 24 hours
        </label>
      </div>
      
      {/* Footer buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
          className="w-20"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          disabled={isLoading || selectedPageUrls.length === 0}
          className="w-20 bg-black text-white hover:bg-black/80"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SitemapSelectionView;
