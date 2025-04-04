
import React from 'react';
import { Button } from '@/components/ui/button';
import { WebPage } from '../../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface SitemapSelectionViewProps {
  webPages: WebPage[];
  selectedPageUrls: string[];
  onSelectionToggle: (pageUrl: string) => void;
  onToggleAll: () => void;
  isLoading: boolean;
  autoSync: boolean;
  setAutoSync: (sync: boolean) => void;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
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
  // Check if all pages are selected
  const allSelected = webPages.length > 0 && selectedPageUrls.length === webPages.length;
  
  // Check if some pages are selected (but not all)
  const someSelected = selectedPageUrls.length > 0 && selectedPageUrls.length < webPages.length;

  // Add the selected status to each web page for easier handling
  const pagesWithSelectionStatus = webPages.map(page => ({
    ...page,
    selected: selectedPageUrls.includes(page.url)
  }));

  console.log('Sitemap selection view - pages:', pagesWithSelectionStatus);
  console.log('Sitemap selection view - selected URLs:', selectedPageUrls);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-all" 
            checked={allSelected}
            onCheckedChange={onToggleAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            {allSelected ? 'Deselect All' : 'Select All'} ({selectedPageUrls.length}/{webPages.length})
          </label>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="max-h-60 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagesWithSelectionStatus.map((page) => (
                <tr key={page.url} className={page.selected ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox 
                      id={`page-${page.url}`} 
                      checked={page.selected}
                      onCheckedChange={() => onSelectionToggle(page.url)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium">{page.title || 'Untitled'}</div>
                    <div className="text-gray-500 text-xs truncate max-w-xs">{page.url}</div>
                  </td>
                </tr>
              ))}
              {webPages.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                    No pages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="auto-sync"
          checked={autoSync}
          onCheckedChange={setAutoSync}
        />
        <label htmlFor="auto-sync" className="text-sm">
          Auto sync every 24 hours
        </label>
      </div>
      
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
          onClick={() => {
            console.log('Save button clicked with selected pages:', selectedPageUrls);
            onConfirm();
          }} 
          disabled={isLoading || selectedPageUrls.length === 0}
          className="w-20 bg-black text-white hover:bg-black/80"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default SitemapSelectionView;
