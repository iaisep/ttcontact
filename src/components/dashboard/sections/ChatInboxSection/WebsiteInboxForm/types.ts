
export interface WebsiteInboxFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export interface WebsiteFormData {
  websiteName: string;
  websiteDomain: string;
  widgetColor: string;
  welcomeHeading: string;
  welcomeTagline: string;
  enableChannelGreeting: boolean;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
}

export interface FormErrors {
  [key: string]: string;
}
