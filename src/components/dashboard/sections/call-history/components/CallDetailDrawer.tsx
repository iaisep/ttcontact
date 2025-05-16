
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
import {
  CallAudioPlayer,
  CallBasicInfo,
  CallContactDetails,
  CallSummarySection,
  TranscriptSection
} from './call-detail';

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

  // Handle audio download
  const handleDownload = () => {
    if (call.recording_url) {
      const link = document.createElement('a');
      link.href = call.recording_url;
      link.download = `call-recording-${call.callId}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle transcript download in JSON format
  const handleDownloadTranscript = () => {
    try {
      // If transcript_with_tool_calls is available, use it
      if (call.transcript_with_tool_calls && Array.isArray(call.transcript_with_tool_calls)) {
        const jsonData = JSON.stringify(call.transcript_with_tool_calls, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `transcript-${call.callId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (call.transcript) {
        // Fallback to plain text transcript if available
        const blob = new Blob([call.transcript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `transcript-${call.callId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading transcript:', error);
    }
  };

  // Determine call summary content to display
  const getCallSummary = () => {
    // Log data for debugging
    console.log("Call summary data:", {
      call_summary: call.call_summary,
      resumen_2da_llamada: call.resumen_2da_llamada
    });
    
    // Prioritize call_summary from API if available
    if (call.call_summary && call.call_summary !== "") {
      return call.call_summary;
    }
    // Fall back to resumen_2da_llamada if call_summary is not available
    if (call.resumen_2da_llamada && call.resumen_2da_llamada !== "") {
      return call.resumen_2da_llamada;
    }
    // Default message if no summary is available
    return t('no_call_summary_available');
  };

  // Get and format the transcript
  const getTranscript = () => {
    if (call.transcript && call.transcript.trim() !== "") {
      return call.transcript;
    }
    return '';
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
          {/* Audio Player */}
          {call.recording_url && (
            <CallAudioPlayer 
              audioUrl={call.recording_url} 
              onDownload={handleDownload} 
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CallBasicInfo 
              timestamp={formatCallTimestamp()}
              agentName={call.agentName}
              type={call.type}
              duration={formatDuration(call.duration)}
            />
            
            <CallContactDetails 
              from={call.from}
              to={call.to}
              status={call.status}
            />
          </div>
          
          {/* Call summary section */}
          <CallSummarySection summary={getCallSummary()} />

          {/* Transcript section - now with transcript_with_tool_calls support */}
          <TranscriptSection 
            transcript={getTranscript()} 
            transcript_with_tool_calls={call.transcript_with_tool_calls}
          />
          
          {/* Call metrics section removed */}
        </div>
        
        <DrawerFooter className="border-t">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
            <Button onClick={handleDownloadTranscript}>{t('download_transcript')}</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CallDetailDrawer;
