
export interface TelegramInboxFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export interface FormData {
  inboxName: string;
  botToken: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
}

export interface FormErrors {
  [key: string]: string;
}
