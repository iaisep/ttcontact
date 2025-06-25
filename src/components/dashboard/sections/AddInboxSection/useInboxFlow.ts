
import { useState } from 'react';
import type { InboxView, Channel } from './types';

export const useInboxFlow = () => {
  const [currentView, setCurrentView] = useState<InboxView>('channel-selection');

  const channels: Channel[] = [
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

  const handleChannelClick = (channel: Channel) => {
    if (channel.enabled) {
      if (channel.id === 'whatsapp') {
        setCurrentView('whatsapp-form');
      } else if (channel.id === 'telegram') {
        setCurrentView('telegram-form');
      } else if (channel.id === 'website') {
        setCurrentView('website-form');
      }
    }
  };

  const handleBackToChannelSelection = () => {
    setCurrentView('channel-selection');
  };

  return {
    currentView,
    channels,
    handleChannelClick,
    handleBackToChannelSelection
  };
};
