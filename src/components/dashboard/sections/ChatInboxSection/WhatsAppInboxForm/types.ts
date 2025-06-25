
export interface FormData {
  apiProvider: string;
  inboxName: string;
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  apiKey: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
}

export interface WhatsAppInboxFormProps {
  onBack: () => void;
  onComplete: () => void;
}
