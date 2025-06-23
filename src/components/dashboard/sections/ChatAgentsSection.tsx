import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, RefreshCw, MessageCircle, ChevronDown, Edit, Trash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TableWithPagination } from '@/components/ui/table-with-pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TelegramAgentModal from './ChatAgentsSection/TelegramAgentModal';
import { toast } from 'sonner';

interface ChatAgent {
  id: string;
  name: string;
  platform: string;
  status: string;
  description: string;
  lastActivity: string;
  messagesCount: number;
  avatar: string;
}

const ChatAgentsSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [chatAgents, setChatAgents] = useState<ChatAgent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);

  const fetchChatAgents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/agent_bots', {
        method: 'GET',
        headers: {
          'api_access_token': 'YZEKfqAJsnEWoshpdRCq9yZn',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Transform API data to match our interface
      const transformedAgents: ChatAgent[] = (data.payload || data || []).map((agent: any, index: number) => ({
        id: agent.id?.toString() || `agent-${index}`,
        name: agent.name || agent.bot_name || `Agent Bot ${index + 1}`,
        platform: agent.platform || agent.channel_type || 'Unknown',
        status: agent.status || (agent.active ? 'active' : 'inactive'),
        description: agent.description || agent.bot_description || 'No description available',
        lastActivity: agent.updated_at || agent.last_activity || new Date().toISOString(),
        messagesCount: agent.messages_count || agent.conversation_count || 0,
        avatar: getPlatformIcon(agent.platform || agent.channel_type || 'Unknown')
      }));

      setChatAgents(transformedAgents);
    } catch (error) {
      console.error('Error fetching chat agents:', error);
      setError('Failed to fetch chat agents. Please try again.');
      
      // Fallback to mock data if API fails
      setChatAgents([
        {
          id: '1',
          name: 'WhatsApp Support Bot',
          platform: 'WhatsApp',
          status: 'active',
          description: 'Customer support agent for WhatsApp',
          lastActivity: '2024-01-15T10:30:00Z',
          messagesCount: 1250,
          avatar: '🤖'
        },
        {
          id: '2',
          name: 'Telegram Sales Assistant',
          platform: 'Telegram',
          status: 'active',
          description: 'Sales and lead generation bot',
          lastActivity: '2024-01-15T09:15:00Z',
          messagesCount: 890,
          avatar: '💼'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatAgents();
  }, []);

  const filteredAgents = searchQuery.trim() === '' 
    ? chatAgents 
    : chatAgents.filter(agent => 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.platform.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleRowClick = (agent: ChatAgent) => {
    navigate(`/chat-agents/${agent.id}/config`);
  };

  const handleAddChatAgent = (platform: string) => {
    console.log(`Adding new chat agent for ${platform}...`);
    if (platform === 'Telegram') {
      setIsTelegramModalOpen(true);
    }
  };

  const handleCreateTelegramAgent = async (agentData: any) => {
    setIsCreatingAgent(true);
    setError(null);
    
    try {
      const response = await fetch('https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/agent_bots', {
        method: 'POST',
        headers: {
          'api_access_token': 'YZEKfqAJsnEWoshpdRCq9yZn',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Agent created successfully:', data);
      
      // Close modal and refresh the list
      setIsTelegramModalOpen(false);
      fetchChatAgents();
      
    } catch (error) {
      console.error('Error creating agent:', error);
      setError('Error al crear el agente. Por favor intente nuevamente.');
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const handleRefresh = () => {
    fetchChatAgents();
  };

  const handleEditAgent = (agent: ChatAgent) => {
    console.log('Editing chat agent:', agent);
    // TODO: Implement edit functionality
    toast.info('Funcionalidad de edición próximamente disponible');
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este agente?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://chatwoot.totalcontact.com.mx/platform/api/v1/agent_bots/${agentId}`, {
        method: 'DELETE',
        headers: {
          'api_access_token': 'C4dZzmKiWBTcXrvyWSxj5dLw',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('Agente eliminado exitosamente');
      fetchChatAgents(); // Refresh the list
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Error al eliminar el agente. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'whatsapp':
        return '💬';
      case 'telegram':
        return '✈️';
      case 'sms':
        return '📱';
      case 'facebook messenger':
      case 'facebook':
        return '📘';
      case 'discord':
        return '🎮';
      case 'instagram':
        return '📷';
      case 'twitter':
        return '🐦';
      default:
        return '🤖';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  };

  const columns = [
    {
      key: 'name',
      header: t('name'),
      cell: (agent: any) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 mr-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg">
            {agent.avatar}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {agent.name}
            </div>
            {agent.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                {agent.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'platform',
      header: 'Platform',
      cell: (agent: any) => (
        <div className="flex items-center">
          <span className="mr-2 text-lg">{getPlatformIcon(agent.platform)}</span>
          <span className="text-sm font-medium">{agent.platform}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (agent: any) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(agent.status)}`}>
          {agent.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: <div className="text-right">Acciones</div>,
      cell: (agent: any) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              handleEditAgent(agent);
            }}
            title="Editar"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              handleDeleteAgent(agent.id);
            }}
            title="Eliminar"
          >
            <Trash size={16} />
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat Agents</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Chat Agent
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
              <DropdownMenuItem 
                onClick={() => handleAddChatAgent('Telegram')}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="mr-2">✈️</span>
                Telegram
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled
                className="cursor-not-allowed opacity-50"
              >
                <span className="mr-2">📷</span>
                Instagram
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled
                className="cursor-not-allowed opacity-50"
              >
                <span className="mr-2">💬</span>
                WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={handleRefresh} title="Refresh" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chat agents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <TableWithPagination
        data={filteredAgents}
        columns={columns}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        initialPageSize={pageSize}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        emptyState={
          <div className="p-8 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">
              {isLoading ? 'Loading chat agents...' : 'No chat agents found'}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {isLoading 
                ? 'Please wait while we fetch your chat agents.'
                : 'Get started by creating your first chat agent for WhatsApp, Telegram, or SMS.'
              }
            </p>
          </div>
        }
        rowClassName="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
      />

      {/* Telegram Agent Modal */}
      <TelegramAgentModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        onSave={handleCreateTelegramAgent}
        isLoading={isCreatingAgent}
      />
    </div>
  );
};

export default ChatAgentsSection;
