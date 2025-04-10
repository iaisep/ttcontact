
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginationControls } from '@/components/ui/pagination';
import { Webhook, EventOption } from './types';
import { WebhookTableRow } from './WebhookTableRow';
import { WebhookTableEmpty } from './WebhookTableEmpty';

interface WebhookTableProps {
  webhooks: Webhook[];
  paginatedWebhooks: Webhook[];
  eventOptions: EventOption[];
  currentPage: number;
  pageSize: number;
  editingWebhookId: string | null;
  editingWebhookUrl: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEditingUrlChange: (url: string) => void;
  onStartEditing: (webhook: Webhook) => void;
  onSaveUrl: (id: string) => void;
  onCancelEditing: () => void;
  onTestWebhook: (id: string) => void;
  onToggleStatus: (id: string, status: 'active' | 'inactive') => void;
  onDeleteWebhook: (id: string) => void;
  onCreateWebhook: () => void;
}

export const WebhookTable = ({
  webhooks,
  paginatedWebhooks,
  eventOptions,
  currentPage,
  pageSize,
  editingWebhookId,
  editingWebhookUrl,
  onPageChange,
  onPageSizeChange,
  onEditingUrlChange,
  onStartEditing,
  onSaveUrl,
  onCancelEditing,
  onTestWebhook,
  onToggleStatus,
  onDeleteWebhook,
  onCreateWebhook
}: WebhookTableProps) => {
  return (
    <>
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5">URL</TableHead>
              <TableHead className="w-1/4">Events</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[10%]">Created</TableHead>
              <TableHead className="w-[10%]">Last Triggered</TableHead>
              <TableHead className="w-[15%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWebhooks.length === 0 ? (
              <WebhookTableEmpty onCreateWebhook={onCreateWebhook} />
            ) : (
              paginatedWebhooks.map((webhook) => (
                <WebhookTableRow
                  key={webhook.id}
                  webhook={webhook}
                  eventOptions={eventOptions}
                  editingWebhookId={editingWebhookId}
                  editingWebhookUrl={editingWebhookUrl}
                  onEditingUrlChange={onEditingUrlChange}
                  onStartEditing={onStartEditing}
                  onSaveUrl={onSaveUrl}
                  onCancelEditing={onCancelEditing}
                  onTestWebhook={onTestWebhook}
                  onToggleStatus={onToggleStatus}
                  onDeleteWebhook={onDeleteWebhook}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {webhooks.length > 0 && (
        <PaginationControls
          totalItems={webhooks.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 25, 50]}
        />
      )}
    </>
  );
};
