
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TranscriptSectionProps {
  transcript: string;
  transcript_with_tool_calls?: any[];
}

const TranscriptSection: React.FC<TranscriptSectionProps> = ({ transcript, transcript_with_tool_calls }) => {
  const { t } = useLanguage();
  
  const renderTranscriptContent = () => {
    // If transcript_with_tool_calls is available, use it
    if (transcript_with_tool_calls && Array.isArray(transcript_with_tool_calls) && transcript_with_tool_calls.length > 0) {
      return (
        <div className="text-sm whitespace-pre-line">
          {transcript_with_tool_calls.map((item, index) => {
            // Handle different types of transcript items
            if (item.role === 'agent' || item.role === 'user') {
              return (
                <div key={index} className="mb-2">
                  <span className="font-semibold">{item.role.charAt(0).toUpperCase() + item.role.slice(1)}: </span>
                  {item.content}
                </div>
              );
            } 
            // Handle tool call invocations
            else if (item.type === 'tool_call_invocation') {
              return (
                <div key={index} className="mb-2 text-blue-600 border-l-4 border-blue-400 pl-2">
                  <span className="font-semibold text-blue-700">→ Tool Invocation: {item.tool_name || 'Unknown Tool'}</span>
                  {item.execution_message && (
                    <div className="text-sm bg-blue-50 p-2 rounded mt-1">
                      {item.execution_message}
                    </div>
                  )}
                  {item.tool_call_id && (
                    <div className="text-xs text-gray-500 mt-1">
                      tool_call_id: {item.tool_call_id}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    
    // Fall back to regular transcript if transcript_with_tool_calls is not available
    if (!transcript) {
      return <div className="text-gray-500 italic">{t('no_transcript_available')}</div>;
    }
    
    return <div className="whitespace-pre-line">{transcript}</div>;
  };
  
  if (!transcript && (!transcript_with_tool_calls || !transcript_with_tool_calls.length)) {
    return null;
  }
  
  return (
    <div className="mt-6 p-3 bg-slate-50 rounded-md">
      <h3 className="font-medium mb-2">{t('transcript')}</h3>
      <ScrollArea className="text-sm bg-white p-3 rounded border border-slate-200 min-h-[150px] max-h-[300px]">
        {renderTranscriptContent()}
      </ScrollArea>
    </div>
  );
};

export default TranscriptSection;
