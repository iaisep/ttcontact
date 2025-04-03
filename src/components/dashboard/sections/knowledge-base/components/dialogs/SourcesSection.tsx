
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Trash2, 
  Globe, 
  File, 
  FileText,
  RefreshCcw 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { KnowledgeBase, KnowledgeBaseSource } from '../../types';

interface SourcesSectionProps {
  knowledgeBase: KnowledgeBase;
  onAddSourceClick: (type: 'url' | 'file' | 'text') => void;
  onDeleteSourceClick: (source: KnowledgeBaseSource) => void;
  onAutoSyncChange: (checked: boolean) => void;
}

const SourcesSection: React.FC<SourcesSectionProps> = ({
  knowledgeBase,
  onAddSourceClick,
  onDeleteSourceClick,
  onAutoSyncChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Sources</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-1 h-3 w-3" /> Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAddSourceClick('url')}>
              <Globe className="mr-2 h-4 w-4" />
              Add Web Pages
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddSourceClick('file')}>
              <File className="mr-2 h-4 w-4" />
              Upload Files
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddSourceClick('text')}>
              <FileText className="mr-2 h-4 w-4" />
              Add Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="border rounded-md divide-y">
        {knowledgeBase.sources.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No sources added yet. Click "Add" to add your first source.
          </div>
        ) : (
          knowledgeBase.sources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-3">
              <div className="flex items-center">
                {source.type === 'url' && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm" title={source.url}>{source.title || source.url}</span>
                    {source.auto_sync && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="ml-2">
                              <RefreshCcw className="h-3 w-3 text-blue-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Auto-sync enabled</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
                {source.type === 'file' && <div className="flex items-center">
                  <File className="h-4 w-4 mr-2 text-amber-500" />
                  <span className="text-sm">{source.title}</span>
                </div>}
                {source.type === 'text' && <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">{source.title}</span>
                </div>}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDeleteSourceClick(source)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))
        )}
      </div>
      
      {knowledgeBase.sources.some(source => source.type === 'url') && (
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="kb-auto-sync"
            checked={knowledgeBase.auto_sync || false}
            onCheckedChange={onAutoSyncChange}
          />
          <Label htmlFor="kb-auto-sync" className="text-sm cursor-pointer">
            Auto sync web pages every 24 hours
          </Label>
        </div>
      )}
    </div>
  );
};

export default SourcesSection;
