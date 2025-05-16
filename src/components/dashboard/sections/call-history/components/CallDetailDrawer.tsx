
import React, { useState, useRef } from 'react';
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
import { X, Play, Pause, Download } from 'lucide-react';
import { CallHistoryItem } from '../types';
import { formatDuration } from '@/lib/utils';

interface CallDetailDrawerProps {
  call: CallHistoryItem;
  onClose: () => void;
}

const CallDetailDrawer: React.FC<CallDetailDrawerProps> = ({ call, onClose }) => {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle audio time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle audio load metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  // Handle audio seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
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
            <div className="mb-6">
              <audio 
                ref={audioRef} 
                src={call.recording_url} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <div className="bg-gray-100 rounded-lg p-2 flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={togglePlayPause}
                  className="h-8 w-8"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-2"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDownload}
                  className="h-8 w-8"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

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
          
          {/* Call summary section - with improved visibility styling */}
          <div className="mt-6 p-3 bg-slate-50 rounded-md">
            <h3 className="font-medium mb-2">{t('call_summary')}</h3>
            <div className="text-sm bg-white p-3 rounded border border-slate-200 min-h-[100px]">
              {getCallSummary()}
            </div>
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
                <p className="text-lg font-semibold">{call.userSentiment || 'Unknown'}</p>
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
            <Button onClick={handleDownload}>{t('download_transcript')}</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CallDetailDrawer;
