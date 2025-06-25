
import React from 'react';
import { useInboxManager } from './ChatInboxSection/useInboxManager';
import InboxHeader from './ChatInboxSection/InboxHeader';
import InboxList from './ChatInboxSection/InboxList';
import type { ChatInboxSectionProps } from './ChatInboxSection/types';

const ChatInboxSection: React.FC<ChatInboxSectionProps> = ({ onNavigateToAddInbox, onInboxCreated }) => {
  const {
    staticInboxes,
    dynamicInboxes,
    allInboxes,
    filteredInboxes
  } = useInboxManager(onInboxCreated);

  const handleAddInbox = () => {
    if (onNavigateToAddInbox) {
      onNavigateToAddInbox();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <InboxHeader onAddInbox={handleAddInbox} />

      {/* Debug info */}
      <div className="text-xs text-gray-500">
        Static inboxes: {staticInboxes.length}, Dynamic inboxes: {dynamicInboxes.length}, Total: {allInboxes.length}
      </div>

      <InboxList inboxes={filteredInboxes} />
    </div>
  );
};

export default ChatInboxSection;
