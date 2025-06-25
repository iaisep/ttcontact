
import React, { useState } from 'react';
import { useInboxManager } from './ChatInboxSection/useInboxManager';
import InboxHeader from './ChatInboxSection/InboxHeader';
import InboxList from './ChatInboxSection/InboxList';
import type { ChatInboxSectionProps } from './ChatInboxSection/types';
import type { Inbox } from './ChatInboxSection/types';

const ChatInboxSection: React.FC<ChatInboxSectionProps> = ({ onNavigateToAddInbox, onInboxCreated }) => {
  const [selectedInbox, setSelectedInbox] = useState<Inbox | null>(null);
  
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

  const handleConfigureInbox = (inbox: Inbox) => {
    setSelectedInbox(inbox);
  };

  const handleBackFromConfig = () => {
    setSelectedInbox(null);
  };

  // Si hay un inbox seleccionado, mostrar su configuración
  if (selectedInbox) {
    // Por ahora solo manejamos WhatsApp
    if (selectedInbox.platform.toLowerCase() === 'whatsapp') {
      const WhatsAppConfigSection = React.lazy(() => 
        import('./ChatInboxSection/InboxConfig/WhatsAppConfigSection')
      );
      
      return (
        <React.Suspense fallback={
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        }>
          <WhatsAppConfigSection 
            inboxId={selectedInbox.id}
            onBack={handleBackFromConfig}
          />
        </React.Suspense>
      );
    }
    
    // Para otras plataformas, mostrar mensaje temporal
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Configuration Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            Configuration for {selectedInbox.platform} is not implemented yet.
          </p>
          <button
            onClick={handleBackFromConfig}
            className="text-blue-600 hover:underline"
          >
            ← Back to Inboxes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <InboxHeader onAddInbox={handleAddInbox} />

      {/* Debug info */}
      <div className="text-xs text-gray-500">
        Static inboxes: {staticInboxes.length}, Dynamic inboxes: {dynamicInboxes.length}, Total: {allInboxes.length}
      </div>

      <InboxList 
        inboxes={filteredInboxes} 
        onConfigureInbox={handleConfigureInbox}
      />
    </div>
  );
};

export default ChatInboxSection;
