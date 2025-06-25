
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface InboxHeaderProps {
  onAddInbox: () => void;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({ onAddInbox }) => {
  return (
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
      <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAddInbox}>
        <Plus className="mr-2 h-4 w-4" />
        Add Inbox
      </Button>
    </div>
  );
};

export default InboxHeader;
