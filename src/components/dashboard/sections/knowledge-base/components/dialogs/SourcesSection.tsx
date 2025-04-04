
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, RefreshCcw } from 'lucide-react';
import { KnowledgeBase, KnowledgeBaseSource } from '../../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SourcesSectionProps {
  knowledgeBase: KnowledgeBase | null;
  onAddSourceClick: (type: 'url' | 'file' | 'text') => void;
  onDeleteSourceClick: (source: KnowledgeBaseSource) => void;
  onAutoSyncChange: (checked: boolean) => void;
  isCreating: boolean;
  creationComplete: boolean;
  isSaving: boolean;
}

const SourcesSection: React.FC<SourcesSectionProps> = ({
  knowledgeBase,
  onAddSourceClick,
  onDeleteSourceClick,
  onAutoSyncChange,
  isCreating,
  creationComplete,
  isSaving
}) => {
  // Handle the case when knowledgeBase is null
  const sources = knowledgeBase?.sources || [];
  const autoSync = knowledgeBase?.auto_sync || false;

  const getSourceTitle = (source: KnowledgeBaseSource) => {
    if (source.type === 'url') {
      return source.url || 'URL Source';
    } else {
      // Use file_name instead of filename
      return source.file_name || 'File Source';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Sources</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-sync"
            checked={autoSync}
            onCheckedChange={onAutoSyncChange}
            disabled={isSaving}
          />
          <Label htmlFor="auto-sync" className="text-sm">
            Auto-sync
          </Label>
        </div>
      </div>
      
      {isCreating && !creationComplete ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Please save the knowledge base first before adding sources.
          </p>
        </div>
      ) : (
        <div>
          <div className="space-y-2 mb-4">
            {sources.length === 0 ? (
              <div className="text-center py-6 border border-dashed rounded-md border-gray-300">
                <p className="text-sm text-muted-foreground">
                  No sources added yet. Add a source to populate your knowledge base.
                </p>
              </div>
            ) : (
              sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-medium truncate max-w-[200px]">
                      {getSourceTitle(source)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {source.type === 'url' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500"
                        disabled={isSaving}
                      >
                        <RefreshCcw className="h-4 w-4" />
                        <span className="sr-only">Sync</span>
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDeleteSourceClick(source)}
                      disabled={isSaving}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-1"
                disabled={isSaving}
              >
                <Plus className="h-4 w-4" />
                Add Source
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem onClick={() => onAddSourceClick('url')}>
                URL / Website
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddSourceClick('file')}>
                File Upload
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddSourceClick('text')}>
                Text Input
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default SourcesSection;
