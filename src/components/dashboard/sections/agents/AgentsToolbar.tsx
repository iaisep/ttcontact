import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, RefreshCw, Link, MessageSquare, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import AgentTemplateDialog from './AgentTemplateDialog';

interface AgentsToolbarProps {
  onAddAgent: () => void;
  onImportAgents: () => void;
  onRefreshAgents: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const AgentsToolbar: React.FC<AgentsToolbarProps> = ({
  onAddAgent,
  onImportAgents,
  onRefreshAgents,
  searchQuery = '',
  onSearchChange = () => {},
}) => {
  const { t } = useLanguage();
  const [folderFilter, setFolderFilter] = useState('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  
  // Mock folders for demonstration
  const folders = ['Personal', 'Business', 'Support'];

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('agents')}</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('create agent')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem 
                onClick={() => setShowTemplateDialog(true)}
                className="flex items-center py-2"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">Single Prompt Agent</p>
                  <p className="text-xs text-muted-foreground">For short calls and straightforward tasks</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowTemplateDialog(true)}
                className="flex items-center py-2"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">WhatsApp Chat Agent</p>
                  <p className="text-xs text-muted-foreground">For WhatsApp business conversations</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled
                className="flex items-center py-2 opacity-50"
              >
                <Link className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">Conversation Flow Agent</p>
                  <p className="text-xs text-muted-foreground">For tasks with complex transitions</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={onRefreshAgents} title={t('refresh')}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search_agents')}
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

      </div>
      
      {showTemplateDialog && (
        <AgentTemplateDialog 
          open={showTemplateDialog} 
          onClose={() => setShowTemplateDialog(false)}
          onSelectTemplate={() => {
            setShowTemplateDialog(false);
            onAddAgent();
          }}
        />
      )}
    </div>
  );
};

export default AgentsToolbar;
