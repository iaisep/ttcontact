
import React, { useState } from 'react';
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
import { KnowledgeBaseSource } from '../../types';

interface SourcesSectionProps {
  sources: KnowledgeBaseSource[];
  onAddSourceClick: (type: 'url' | 'file' | 'text') => void;
  onDeleteSource: (source: KnowledgeBaseSource) => void;
  sourcesToDelete?: Set<string>; 
  setSourcesMarkedForDeletion?: (sources: Set<string>) => void;
}

const SourcesSection: React.FC<SourcesSectionProps> = ({
  sources,
  onAddSourceClick,
  onDeleteSource,
  sourcesToDelete = new Set<string>(),
  setSourcesMarkedForDeletion = () => {},
}) => {
  // Mark a source for deletion instead of immediately deleting it
  const handleMarkForDeletion = (source: KnowledgeBaseSource) => {
    console.log("Marking source for deletion:", source);
    const newSet = new Set(sourcesToDelete);
    newSet.add(source.id);
    setSourcesMarkedForDeletion(newSet);
  };

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
        {sources.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No sources added yet. Click "Add" to add your first source.
          </div>
        ) : (
          sources.map((source) => {
            const isMarkedForDeletion = sourcesToDelete.has(source.id);
            
            return (
              <div 
                key={source.id} 
                className={`flex items-center justify-between p-3 ${
                  isMarkedForDeletion ? 'opacity-50 bg-gray-50 dark:bg-gray-800' : ''
                }`}
              >
                <div className="flex items-center">
                  {source.type === 'url' && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm" title={source.url}>{source.title || source.url}</span>
                      {source.auto_sync && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-2">
                                <RefreshCcw className="h-3 w-3 text-blue-500" />
                              </span>
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
                  variant={isMarkedForDeletion ? "destructive" : "ghost"}
                  size="icon"
                  onClick={() => {
                    if (isMarkedForDeletion) {
                      // Unmark for deletion
                      const newSet = new Set(sourcesToDelete);
                      newSet.delete(source.id);
                      setSourcesMarkedForDeletion(newSet);
                    } else {
                      // Mark for deletion
                      handleMarkForDeletion(source);
                    }
                  }}
                  title={isMarkedForDeletion ? "Undo deletion" : "Mark for deletion"}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })
        )}
      </div>
      
      {sources.some(source => source.type === 'url') && (
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="kb-auto-sync"
            checked={false}
            onCheckedChange={() => {}}
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
