
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ChannelGrid from './ChannelGrid';
import StepsGuide from './StepsGuide';
import type { Channel } from './types';

interface ChannelSelectionProps {
  channels: Channel[];
  onChannelClick: (channel: Channel) => void;
  onBack: () => void;
}

const ChannelSelection: React.FC<ChannelSelectionProps> = ({
  channels,
  onChannelClick,
  onBack
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inboxes
        </Button>
        <h1 className="text-2xl font-bold">Add New Inbox</h1>
      </div>
      
      <div className="space-y-6">
        <StepsGuide />

        <div>
          <h2 className="text-xl font-semibold mb-2">Choose a channel</h2>
          <p className="text-gray-600 mb-6">
            Chatwoot supports live-chat widgets, Facebook Messenger, WhatsApp, Emails, etc., as channels. If you want to build 
            a custom channel, you can create it using the API channel. To get started, choose one of the channels below.
          </p>
          
          <ChannelGrid channels={channels} onChannelClick={onChannelClick} />
        </div>
      </div>
    </div>
  );
};

export default ChannelSelection;
