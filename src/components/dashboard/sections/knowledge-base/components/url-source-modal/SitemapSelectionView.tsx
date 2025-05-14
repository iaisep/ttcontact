
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, RefreshCw } from 'lucide-react';
import { WebPage, KnowledgeBase } from '../../types';

interface SitemapSelectionViewProps {
  url: string;
  autoSync: boolean;
  setAutoSync: (value: boolean) => void;
  webPages: WebPage[];
  selectedPageUrls: string[];
  onSelectionToggle: (pageUrl: string) => void;
  onToggleAll: () => void;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
  currentKnowledgeBase: KnowledgeBase | null;
  knowledgeBaseName?: string;
}

const SitemapSelectionView: React.FC<SitemapSelectionViewProps> = ({
  url,
  autoSync,
  setAutoSync,
  webPages,
  selectedPageUrls,
  onSelectionToggle,
  onToggleAll,
  onConfirm,
  onBack,
  isLoading,
  currentKnowledgeBase,
  knowledgeBaseName
}) => {
  const hasSelectedPages = selectedPageUrls.length > 0;
  const hasKnowledgeBase = !!currentKnowledgeBase?.id || !!knowledgeBaseName;
  const canProceed = hasSelectedPages && hasKnowledgeBase;
  
  const displayName = knowledgeBaseName || (currentKnowledgeBase && currentKnowledgeBase.name);

  return (
    <div className="space-y-4 p-6">
      {displayName && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-md mb-2">
          <Info className="h-4 w-4" />
          <span className="text-sm">Adding to knowledge base: <strong>{displayName}</strong></span>
        </div>
      )}
      
      <div className="flex flex-col">
        <h3 className="font-medium text-sm mb-2">Found {webPages.length} URLs at {url}</h3>
        
        <div className="flex items-center mb-4">
          <Checkbox
            id="auto-sync"
            checked={autoSync}
            onCheckedChange={(checked) => setAutoSync(checked as boolean)}
          />
          <label htmlFor="auto-sync" className="ml-2 text-sm flex items-center gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            Automatically refresh content (daily)
          </label>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Select pages to include:</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleAll}
            className="text-xs"
          >
            {selectedPageUrls.length === webPages.length ? 'Deselect all' : 'Select all'}
          </Button>
        </div>
        
        <div className="border rounded-md max-h-60 overflow-y-auto">
          {webPages.map((page) => (
            <div 
              key={page.url}
              className="flex items-center px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
            >
              <Checkbox
                id={`page-${page.url}`}
                checked={selectedPageUrls.includes(page.url)}
                onCheckedChange={() => onSelectionToggle(page.url)}
              />
              <label htmlFor={`page-${page.url}`} className="ml-2 text-sm truncate flex-grow cursor-pointer">
                {page.title || page.url}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!canProceed || isLoading}
            className={isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {isLoading ? 'Adding...' : 'Add to Knowledge Base'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SitemapSelectionView;
