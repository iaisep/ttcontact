
export type InboxView = 'channel-selection' | 'whatsapp-form' | 'telegram-form' | 'website-form';

export interface Channel {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export interface AddInboxSectionProps {
  onBack: () => void;
  onComplete: () => void;
}
