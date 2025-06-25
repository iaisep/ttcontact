
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Trash2 } from 'lucide-react';
import type { Inbox } from './types';

interface InboxListProps {
  inboxes: Inbox[];
}

const InboxList: React.FC<InboxListProps> = ({ inboxes }) => {
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

  if (inboxes.length === 0) {
    return (
      <div className="space-y-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium">No inboxes found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            No inboxes match your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {inboxes.map((inbox, index) => (
        <div
          key={inbox.id}
          className={`p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            index !== inboxes.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
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
      ))}
    </div>
  );
};

export default InboxList;
