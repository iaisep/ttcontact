
import React from 'react';
import { Button } from '@/components/ui/button';
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
  const groupedPages = webPages.reduce((acc, page) => {
    const domain = new URL(page.url).hostname;
    
    if (!acc[domain]) {
      acc[domain] = [];
    }
    
    acc[domain].push(page);
    return acc;
  }, {} as Record<string, WebPage[]>);

  const domains = Object.keys(groupedPages);
  const totalPagesCount = webPages.length;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Select Site Maps</h2>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="select-all" 
            checked={selectedPageUrls.length === totalPagesCount && totalPagesCount > 0}
            onCheckedChange={() => onToggleAll()}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All ({totalPagesCount})
          </label>
        </div>
        <div className="text-blue-600 text-sm">
          Selected({selectedPageUrls.length})
        </div>
      </div>
      
      <div className="border rounded-md max-h-[300px] overflow-y-auto">
        {domains.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No pages found in the sitemap.
          </div>
        ) : (
          <div className="divide-y">
            {domains.map(domain => (
              <div key={domain} className="py-2 px-3">
                <div className="flex items-center mb-2">
                  <button 
                    className="flex items-center gap-1 text-sm font-medium"
                    onClick={() => {/* Toggle domain expand/collapse */}}
                  >
                    <span>▾</span> {/* This is the expand/collapse icon */}
                    <Checkbox 
                      checked={groupedPages[domain].every(page => 
                        selectedPageUrls.includes(page.url)
                      )}
                      onCheckedChange={() => {
                        // Select/deselect all pages in this domain
                        const allSelected = groupedPages[domain].every(
                          page => selectedPageUrls.includes(page.url)
                        );
                        
                        if (allSelected) {
                          // Deselect all in this domain
                          groupedPages[domain].forEach(page => {
                            if (selectedPageUrls.includes(page.url)) {
                              onSelectionToggle(page.url);
                            }
                          });
                        } else {
                          // Select all in this domain
                          groupedPages[domain].forEach(page => {
                            if (!selectedPageUrls.includes(page.url)) {
                              onSelectionToggle(page.url);
                            }
                          });
                        }
                      }}
                    />
                    <span className="ml-2">{domain} ({groupedPages[domain].length})</span>
                  </button>
                </div>
                
                <div className="ml-6 space-y-1">
                  {groupedPages[domain].map(page => (
                    <div 
                      key={page.url}
                      className="flex items-center py-1"
                    >
                      <Checkbox 
                        checked={selectedPageUrls.includes(page.url)}
                        onCheckedChange={() => onSelectionToggle(page.url)}
                        id={`page-${page.url}`}
                      />
                      <label 
                        htmlFor={`page-${page.url}`}
                        className="ml-2 text-sm cursor-pointer truncate"
                      >
                        {page.url}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={() => {/* Cancel button handler */}}
          disabled={isLoading}
          className="w-20"
        >
          Cancel
        </Button>
        <Button 
          onClick={() => {/* Save button handler */}}
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
