
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MessageSquare, Clock, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  platform: string;
  status: 'unread' | 'read' | 'replied';
  avatar: string;
}

const ChatInboxSection: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for chat messages
  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'Juan Pérez',
      message: 'Hola, necesito información sobre sus productos',
      timestamp: '2024-01-15T10:30:00Z',
      platform: 'Telegram',
      status: 'unread',
      avatar: '👤'
    },
    {
      id: '2',
      sender: 'María García',
      message: '¿Cuál es el horario de atención?',
      timestamp: '2024-01-15T09:15:00Z',
      platform: 'WhatsApp',
      status: 'read',
      avatar: '👩'
    },
    {
      id: '3',
      sender: 'Carlos López',
      message: 'Gracias por la información',
      timestamp: '2024-01-15T08:45:00Z',
      platform: 'Telegram',
      status: 'replied',
      avatar: '👨'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'read':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'replied':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'whatsapp':
        return '💬';
      case 'telegram':
        return '✈️';
      case 'facebook':
        return '📘';
      case 'instagram':
        return '📷';
      default:
        return '💬';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredMessages = searchQuery.trim() === '' 
    ? chatMessages 
    : chatMessages.filter(message => 
        message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat Inbox</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar conversaciones..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No hay mensajes</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              No se encontraron conversaciones que coincidan con tu búsqueda.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {filteredMessages.map((message, index) => (
              <div
                key={message.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                  index !== filteredMessages.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar and Platform */}
                  <div className="flex-shrink-0 relative">
                    <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg">
                      {message.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 text-sm">
                      {getPlatformIcon(message.platform)}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {message.sender}
                        </h3>
                        <span className="text-xs text-gray-500">{message.platform}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                          {message.status === 'unread' ? 'No leído' : 
                           message.status === 'read' ? 'Leído' : 'Respondido'}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInboxSection;
