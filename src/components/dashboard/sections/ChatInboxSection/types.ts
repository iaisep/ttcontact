
export interface Inbox {
  id: string;
  name: string;
  platform: string;
  url?: string;
  icon: string;
  status: 'active' | 'inactive';
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface ChatInboxSectionProps {
  onNavigateToAddInbox?: () => void;
  onInboxCreated?: (inbox: Inbox) => void;
}

export interface InboxFormData {
  name: string;
  platform: string;
  phoneNumber?: string;
  botToken?: string;
}
