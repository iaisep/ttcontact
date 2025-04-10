
import { useState } from 'react';
import {
  WebhookHeader,
  WebhookSearch,
  WebhookTable,
  WebhookCreateDialog,
  WebhookLoading,
  eventOptions,
  useWebhooks
} from './webhooks';

const WebhooksSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    loading,
    searchQuery, 
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    editingWebhookId,
    editingWebhookUrl,
    setEditingWebhookUrl,
    filteredWebhooks,
    paginatedWebhooks,
    startEditingWebhook,
    saveWebhookUrl,
    cancelEditingWebhook,
    testWebhook,
    toggleWebhookStatus,
    deleteWebhook,
    createWebhook
  } = useWebhooks();

  const handleCreateWebhook = async (url: string, selectedEvents: string[]) => {
    const success = await createWebhook(url, selectedEvents);
    if (success) {
      setDialogOpen(false);
    }
    return success;
  };

  return (
    <div className="space-y-6">
      <WebhookHeader onCreateWebhook={() => setDialogOpen(true)} />
      <WebhookSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {loading ? (
        <WebhookLoading />
      ) : (
        <WebhookTable
          webhooks={filteredWebhooks}
          paginatedWebhooks={paginatedWebhooks}
          eventOptions={eventOptions}
          currentPage={currentPage}
          pageSize={pageSize}
          editingWebhookId={editingWebhookId}
          editingWebhookUrl={editingWebhookUrl}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onEditingUrlChange={setEditingWebhookUrl}
          onStartEditing={startEditingWebhook}
          onSaveUrl={saveWebhookUrl}
          onCancelEditing={cancelEditingWebhook}
          onTestWebhook={testWebhook}
          onToggleStatus={toggleWebhookStatus}
          onDeleteWebhook={deleteWebhook}
          onCreateWebhook={() => setDialogOpen(true)}
        />
      )}

      <WebhookCreateDialog
        open={dialogOpen}
        eventOptions={eventOptions}
        onOpenChange={setDialogOpen}
        onCreateWebhook={handleCreateWebhook}
      />
    </div>
  );
};

export default WebhooksSection;
