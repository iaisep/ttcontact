
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreHorizontal, Settings, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddInboxModal from './ChatInboxSection/AddInboxModal';

interface Inbox {
  id: string;
  name: string;
  platform: string;
  url?: string;
  icon: string;
  status: 'active' | 'inactive';
}

const ChatInboxSection: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddInboxModalOpen, setIsAddInboxModalOpen] = useState(false);

  // Mock data for inboxes based on the image
  const inboxes: Inbox[] = [
    {
      id: '1',
      name: 'Maikelcontactbot',
      platform: 'Telegram',
      icon: '✈️',
      status: 'active'
    },
    {
      id: '2',
      name: 'Https://Totalcontact.Com.Mx/',
      platform: 'Website',
      url: 'https://totalcontact.com.mx/',
      icon: '🌐',
      status: 'active'
    },
    {
      id: '3',
      name: 'Isep_whatsapp_',
      platform: 'WhatsApp',
      icon: '💬',
      status: 'active'
    },
    {
      id: '4',
      name: 'Https://Escuinapa.Totalcontact.Com.Mx/',
      platform: 'Website',
      url: 'https://escuinapa.totalcontact.com.mx/',
      icon: '🌐',
      status: 'active'
    },
    {
      id: '5',
      name: 'Https://Rincon.Totalcontact.Com.Mx/',
      platform: 'Website',
      url: 'https://rincon.totalcontact.com.mx/',
      icon: '🌐',
      status: 'active'
    }
  ];

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'telegram':
        return 'text-blue-600';
      case 'whatsapp':
        return 'text-green-600';
      case 'website':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredInboxes = searchQuery.trim() === '' 
    ? inboxes 
    : inboxes.filter(inbox => 
        inbox.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inbox.platform.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleAddInbox = () => {
    setIsAddInboxModalOpen(true);
  };

  const handleChannelSelect = (channel: string) => {
    console.log(`Selected channel: ${channel}`);
    setIsAddInboxModalOpen(false);
    // Handle channel selection logic here
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Inboxes</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            A channel is the mode of communication your customer chooses to interact with you. An inbox is where you
            manage interactions for a specific channel. It can include communications from various sources such as email, live
            chat, and social media.
          </p>
          <div className="mt-2">
            <button className="text-blue-600 text-sm hover:underline">
              Learn more about inboxes →
            </button>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddInbox}>
          <Plus className="mr-2 h-4 w-4" />
          Add Inbox
        </Button>
      </div>

      {/* Inbox List */}
      <div className="space-y-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {filteredInboxes.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">No inboxes found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              No inboxes match your search criteria.
            </p>
          </div>
        ) : (
          filteredInboxes.map((inbox, index) => (
            <div
              key={inbox.id}
              className={`p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                index !== filteredInboxes.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
              }`}
            >
              {/* Left side - Icon and Info */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center text-lg">
                    {inbox.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {inbox.name}
                  </h3>
                  <p className={`text-sm ${getPlatformColor(inbox.platform)}`}>
                    {inbox.platform}
                  </p>
                </div>
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Inbox Modal */}
      <AddInboxModal
        isOpen={isAddInboxModalOpen}
        onClose={() => setIsAddInboxModalOpen(false)}
        onChannelSelect={handleChannelSelect}
      />
    </div>
  );
};

export default ChatInboxSection;
