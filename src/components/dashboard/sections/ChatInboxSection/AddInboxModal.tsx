
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';

interface AddInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelSelect: (channel: string) => void;
}

const AddInboxModal: React.FC<AddInboxModalProps> = ({
  isOpen,
  onClose,
  onChannelSelect
}) => {
  const channels = [
    {
      id: 'website',
      name: 'Website',
      icon: '💬',
      color: 'bg-blue-500',
      enabled: true
    },
    {
      id: 'messenger',
      name: 'Messenger',
      icon: '💬',
      color: 'bg-gray-500',
      enabled: false
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500',
      enabled: true
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: '💬',
      color: 'bg-blue-400',
      enabled: false
    },
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      color: 'bg-yellow-500',
      enabled: false
    },
    {
      id: 'api',
      name: 'API',
      icon: '🔗',
      color: 'bg-blue-600',
      enabled: false
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-blue-500',
      enabled: true
    },
    {
      id: 'line',
      name: 'Line',
      icon: '💬',
      color: 'bg-green-600',
      enabled: false
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: 'bg-pink-500',
      enabled: false
    }
  ];

  const handleChannelClick = (channel: any) => {
    if (channel.enabled) {
      onChannelSelect(channel.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <DialogTitle>Inboxes</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium text-blue-600">Choose Channel</h3>
                <p className="text-sm text-gray-600">
                  Choose the provider you want to integrate with Chatwoot.
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">2</span>
                <span>Create Inbox</span>
              </div>
              <div className="ml-6 text-xs">Authenticate your account and create an Inbox.</div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-400">3</span>
                <span>Add Agents</span>
              </div>
              <div className="ml-6 text-xs">Add agents to the created Inbox.</div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-400">4</span>
                <span>Voilà!</span>
              </div>
              <div className="ml-6 text-xs">You are all set to go!</div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Choose a channel</h2>
            <p className="text-gray-600 mb-6">
              Chatwoot supports live-chat widgets, Facebook Messenger, WhatsApp, Emails, etc., as channels. If you want to build 
              a custom channel, you can create it using the API channel. To get started, choose one of the channels below.
            </p>
            
            <div className="grid grid-cols-3 gap-6">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`relative p-6 border rounded-lg text-center cursor-pointer transition-all ${
                    channel.enabled 
                      ? 'hover:border-blue-500 hover:shadow-md' 
                      : 'opacity-50 cursor-not-allowed bg-gray-50'
                  }`}
                  onClick={() => handleChannelClick(channel)}
                >
                  <div className={`w-16 h-16 ${channel.color} rounded-lg mx-auto mb-3 flex items-center justify-center text-white text-2xl`}>
                    {channel.icon}
                  </div>
                  <h3 className="font-medium">{channel.name}</h3>
                  {!channel.enabled && (
                    <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500 font-medium">Coming Soon</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddInboxModal;
