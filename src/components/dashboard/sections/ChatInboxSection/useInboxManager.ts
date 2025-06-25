
import { useState, useEffect } from 'react';
import type { Inbox, InboxFormData } from './types';

export const useInboxManager = (onInboxCreated?: (inbox: Inbox) => void) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicInboxes, setDynamicInboxes] = useState<Inbox[]>([]);

  // Mock data for inboxes based on the image
  const staticInboxes: Inbox[] = [
    {
      id: '1',
      name: 'Maikelcontactbot',
      platform: 'Telegram',
      icon: '✈️',
      status: 'active'
    },
    {
      id: '2',
      name: 'Https://Totalcontact.Com.Mx/',
      platform: 'Website',
      url: 'https://totalcontact.com.mx/',
      icon: '🌐',
      status: 'active'
    },
    {
      id: '3',
      name: 'Isep_whatsapp_',
      platform: 'WhatsApp',
      icon: '💬',
      status: 'active'
    },
    {
      id: '4',
      name: 'Https://Escuinapa.Totalcontact.Com.Mx/',
      platform: 'Website',
      url: 'https://escuinapa.totalcontact.com.mx/',
      icon: '🌐',
      status: 'active'
    },
    {
      id: '5',
      name: 'Https://Rincon.Totalcontact.Com.Mx/',
      platform: 'Website',
      url: 'https://rincon.totalcontact.com.mx/',
      icon: '🌐',
      status: 'active'
    }
  ];

  // Combine static and dynamic inboxes
  const allInboxes = [...staticInboxes, ...dynamicInboxes];

  const filteredInboxes = searchQuery.trim() === '' 
    ? allInboxes 
    : allInboxes.filter(inbox => 
        inbox.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inbox.platform.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Function to add a new inbox to the list
  const addNewInbox = (inboxData: InboxFormData) => {
    console.log('Adding new inbox:', inboxData);
    
    const newInbox: Inbox = {
      id: Date.now().toString(),
      name: inboxData.name,
      platform: inboxData.platform,
      icon: inboxData.platform === 'WhatsApp' ? '💬' : 
            inboxData.platform === 'Telegram' ? '✈️' : '🌐',
      status: 'active'
    };
    
    console.log('New inbox created:', newInbox);
    
    setDynamicInboxes(prev => {
      const updated = [...prev, newInbox];
      console.log('Updated dynamic inboxes:', updated);
      return updated;
    });
    
    if (onInboxCreated) {
      onInboxCreated(newInbox);
    }
  };

  // Expose the addNewInbox function globally so it can be called from forms
  useEffect(() => {
    (window as any).addNewInbox = addNewInbox;
    console.log('addNewInbox function exposed to window');
    
    return () => {
      delete (window as any).addNewInbox;
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    staticInboxes,
    dynamicInboxes,
    allInboxes,
    filteredInboxes,
    addNewInbox
  };
};
