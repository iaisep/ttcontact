
import React from 'react';

interface TranscriptPanelProps {
  transcript: string;
  isVisible: boolean;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="w-full rounded-md bg-blue-50 p-0 text-sm text-blue-700 mt-2 mb-6 h-[1px] overflow-y-auto">
    {/*  {transcript}*/}
    </div>
  );
};

export default TranscriptPanel;
