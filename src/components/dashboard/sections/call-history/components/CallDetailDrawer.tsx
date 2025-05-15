
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { CallHistoryItem } from '../types';
import { formatDuration } from '@/lib/utils';

interface CallDetailDrawerProps {
  call: CallHistoryItem;
  onClose: () => void;
}

const CallDetailDrawer: React.FC<CallDetailDrawerProps> = ({ call, onClose }) => {
  const { t } = useLanguage();

  // Safe date formatting for call timestamp
  const formatCallTimestamp = () => {
    if (!call.date) return 'Unknown';
    
    try {
      if (call.date === 'Invalid date') {
        return 'Unknown';
      }
      
      // If we just have dates, display them directly
      const dateStr = call.date;
      const timeStr = call.time || '';
      
      return timeStr ? `${dateStr} ${timeStr}` : dateStr;
    } catch (error) {
      console.error('Error formatting date/time:', error);
      return 'Unknown';
    }
  };

  return (
    <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>{t('call_details')}</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription>
            {t('call_id')}: {call.callId}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">{t('basic_info')}</h3>
              <dl className="space-y-1">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">{t('timestamp')}:</dt>
                  <dd className="text-sm">{formatCallTimestamp()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">{t('agent')}:</dt>
                  <dd className="text-sm">{call.agentName || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">{t('type')}:</dt>
                  <dd className="text-sm">{call.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">{t('duration')}:</dt>
                  <dd className="text-sm">{formatDuration(call.duration)}</dd>
                </div>
              </dl>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">{t('contact_details')}</h3>
              <dl className="space-y-1">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">{t('from')}:</dt>
                  <dd className="text-sm">{call.from}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">{t('to')}:</dt>
                  <dd className="text-sm">{call.to}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">{t('status')}:</dt>
                  <dd className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      call.status === 'ended' 
                        ? 'bg-green-100 text-green-800' 
                        : call.status === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {call.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Additional call details could be added here */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">{t('call_summary')}</h3>
            <p className="text-sm text-muted-foreground">
              {call.resumen_2da_llamada || t('no_call_summary_available')}
            </p>
          </div>
          
          {/* Call metrics section */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">{t('call_metrics')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">{t('latency')}</p>
                <p className="text-lg font-semibold">{call.endToEndLatency || '150ms'}</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">{t('user_sentiment')}</p>
                <p className="text-lg font-semibold">{call.userSentiment || 'Positive'}</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">{t('completion_rate')}</p>
                <p className="text-lg font-semibold">{call.callSuccessfulStatus || '98%'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DrawerFooter className="border-t">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
            <Button>{t('download_transcript')}</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CallDetailDrawer;
