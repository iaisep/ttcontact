import React, { useState } from 'react';
import { useChatwootInboxManager } from './ChatInboxSection/useChatwootInboxManager';
import { useInboxDetails } from './ChatInboxSection/InboxConfig/useInboxDetails';
import { InboxContextProvider } from '@/context/InboxContext';
import InboxHeader from './ChatInboxSection/InboxHeader';
import InboxList from './ChatInboxSection/InboxList';
import type { ChatInboxSectionProps } from './ChatInboxSection/types';
import type { Inbox } from './ChatInboxSection/types';

const ChatInboxSection: React.FC<ChatInboxSectionProps> = ({ onNavigateToAddInbox, onInboxCreated }) => {
  const [selectedInbox, setSelectedInbox] = useState<Inbox | null>(null);
  
  const {
    searchQuery,
    setSearchQuery,
    inboxes,
    filteredInboxes,
    loading,
    error,
    loadInboxes,
    deleteInbox,
  } = useChatwootInboxManager(onInboxCreated);

  // Hook para obtener detalles del inbox seleccionado
  const { inboxDetails, loading: detailsLoading } = useInboxDetails(selectedInbox?.id || null);

  const handleAddInbox = () => {
    if (onNavigateToAddInbox) {
      onNavigateToAddInbox();
    }
  };

  const handleConfigureInbox = (inbox: Inbox) => {
    console.log('Configuring inbox:', inbox);
    setSelectedInbox(inbox);
  };

  const handleBackFromConfig = () => {
    setSelectedInbox(null);
  };

  const handleDeleteInbox = async (inbox: Inbox) => {
    if (confirm(`Are you sure you want to delete the inbox "${inbox.name}"?`)) {
      try {
        await deleteInbox(inbox.id);
      } catch (error) {
        console.error('Failed to delete inbox:', error);
      }
    }
  };

  // Si hay un inbox seleccionado, mostrar su configuración
  if (selectedInbox) {
    const platform = selectedInbox.platform.toLowerCase();
    console.log('Selected inbox platform:', platform, 'Full inbox:', selectedInbox);
    console.log('Inbox details from API:', inboxDetails);
    
    // Verificar múltiples variaciones posibles de WhatsApp
    if (platform === 'whatsapp' || platform === 'whats app' || platform.includes('whatsapp') || selectedInbox.platform === 'WhatsApp') {
      const WhatsAppConfigSection = React.lazy(() => 
        import('./ChatInboxSection/InboxConfig/WhatsAppConfigSection')
      );
      
      return (
        <InboxContextProvider>
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
              inboxDetails={inboxDetails}
              onBack={handleBackFromConfig}
            />
          </React.Suspense>
        </InboxContextProvider>
      );
    }

    if (platform === 'telegram' || platform.includes('telegram')) {
      const TelegramConfigSection = React.lazy(() => 
        import('./ChatInboxSection/InboxConfig/TelegramConfigSection')
      );
      
      return (
        <InboxContextProvider>
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
            <TelegramConfigSection 
              inboxId={selectedInbox.id}
              inboxDetails={inboxDetails}
              onBack={handleBackFromConfig}
            />
          </React.Suspense>
        </InboxContextProvider>
      );
    }

    if (platform === 'website' || platform === 'web_widget' || platform.includes('website')) {
      const WebsiteConfigSection = React.lazy(() => 
        import('./ChatInboxSection/InboxConfig/WebsiteConfigSection')
      );
      
      return (
        <InboxContextProvider>
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
            <WebsiteConfigSection 
              inboxId={selectedInbox.id}
              inboxDetails={inboxDetails}
              onBack={handleBackFromConfig}
            />
          </React.Suspense>
        </InboxContextProvider>
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <InboxHeader onAddInbox={handleAddInbox} />
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <InboxHeader onAddInbox={handleAddInbox} />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Error loading inboxes</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={loadInboxes}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <InboxHeader 
        onAddInbox={handleAddInbox}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="text-xs text-gray-500">
        Total inboxes: {inboxes.length}, Showing: {filteredInboxes.length}
      </div>

      <InboxList 
        inboxes={filteredInboxes} 
        onConfigureInbox={handleConfigureInbox}
        onDeleteInbox={handleDeleteInbox}
      />
    </div>
  );
};

export default ChatInboxSection;
