
import React from 'react';
import { X, User, Phone, Calendar, Clock, MessageSquare } from 'lucide-react';
import { CallDetailInfo } from '../types';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CallDetailDrawerProps {
  call: CallDetailInfo | null;
  onClose: () => void;
}

const CallDetailDrawer: React.FC<CallDetailDrawerProps> = ({ call, onClose }) => {
  const { t } = useLanguage();

  if (!call) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ended':
        return <Badge className="bg-green-100 text-green-800 border-green-300">{t('ended')}</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-300">{t('error')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return <Badge className="bg-green-100 text-green-800 border-green-300">{t('positive')}</Badge>;
      case 'Neutral':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">{t('neutral')}</Badge>;
      case 'Negative':
        return <Badge className="bg-red-100 text-red-800 border-red-300">{t('negative')}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{t('unknown')}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
      <div className="bg-background w-full max-w-md h-full overflow-y-auto shadow-lg flex flex-col">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">{t('call_details')}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-grow p-4 space-y-6">
          {/* Call ID */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-semibold text-muted-foreground">
              {t('call_id')}
            </div>
            <div className="font-mono">{call.callId}</div>
          </div>
          
          {/* Call Information */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold border-b pb-2">
              {t('call_information')}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('date')}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{call.date}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('time')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{call.time}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('duration')}
                </div>
                <span>{call.duration}</span>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('cost')}
                </div>
                <span>{call.cost}</span>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('from')}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{call.from}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('to')}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{call.to}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('status')}
                </div>
                {getStatusBadge(call.status)}
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('disconnection_reason')}
                </div>
                <span>{call.disconnectionReason}</span>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('user_sentiment')}
                </div>
                {getSentimentBadge(call.userSentiment)}
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('call_successful')}
                </div>
                <span>{call.callSuccessfulStatus || (call.callSuccessful ? t('successful') : t('unsuccessful'))}</span>
              </div>
              
              {call.endToEndLatency && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    {t('end_to_end_latency')}
                  </div>
                  <span>{call.endToEndLatency}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Agent Information */}
          {call.agentName && (
            <div className="space-y-4">
              <h3 className="text-md font-semibold border-b pb-2">
                {t('agent_information')}
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    {t('agent_name')}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{call.agentName}</span>
                  </div>
                </div>
                
                {call.agentDetails && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      {t('agent_type')}
                    </div>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      {(call.agentDetails.agent_type || "").replace('retell-llm', 'uisep-llm')}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Analysis Results */}
          {(call.oportunidad !== undefined || call.opportunidad || call.resumen_2da_llamada) && (
            <div className="space-y-4">
              <h3 className="text-md font-semibold border-b pb-2">
                {t('analysis_results')}
              </h3>
              
              <div className="space-y-3">
                {call.opportunidad && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      {t('opportunidad')}
                    </div>
                    <p>{call.opportunidad}</p>
                  </div>
                )}
                
                {call.oportunidad !== undefined && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      {t('oportunidad')}
                    </div>
                    <Badge className={call.oportunidad ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {call.oportunidad ? t('true') : t('false')}
                    </Badge>
                  </div>
                )}
                
                {call.resumen_2da_llamada && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      {t('resumen_2da_llamada')}
                    </div>
                    <p>{call.resumen_2da_llamada}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Transcript */}
          {call.transcript && (
            <div className="space-y-4">
              <h3 className="text-md font-semibold border-b pb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('transcript')}
              </h3>
              
              <div className="bg-muted p-3 rounded-lg max-h-60 overflow-y-auto whitespace-pre-wrap text-sm">
                {call.transcript}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallDetailDrawer;
