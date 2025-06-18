import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, RefreshCw, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TableWithPagination } from '@/components/ui/table-with-pagination';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [chatAgents, setChatAgents] = useState<ChatAgent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchChatAgents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://chatwoot.totalcontact.com.mx/platform/api/v1/agent_bots', {
        method: 'GET',
        headers: {
          'api_access_token': 'C4dZzmKiWBTcXrvyWSxj5dLw',
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

  const handleAddChatAgent = () => {
    console.log('Adding new chat agent...');
  };

  const handleRefresh = () => {
    fetchChatAgents();
  };

  const handleEditAgent = (agent: any) => {
    console.log('Editing chat agent:', agent);
  };

  const handleDeleteAgent = (agentId: string) => {
    console.log('Deleting chat agent:', agentId);
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
      key: 'messagesCount',
      header: 'Messages',
      cell: (agent: any) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {agent.messagesCount.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat Agents</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddChatAgent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Chat Agent
          </Button>
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
        onRowClick={(agent) => console.log('View chat agent:', agent)}
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
    </div>
  );
};

export default ChatAgentsSection;
