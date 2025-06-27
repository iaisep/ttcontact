
export interface WhatsAppConfigData {
  // Settings tab
  inboxName: string;
  channelAvatar: string;
  apiProvider: string;
  enableChannelGreeting: boolean;
  helpCenter: string;
  lockToSingleConversation: boolean;

  // Collaborators tab
  agents: string[];
  enableAutoAssignment: boolean;
  autoAssignmentLimit: number;

  // Business Hours tab
  enableBusinessAvailability: boolean;
  unavailableMessage: string;
  timezone: string;
  weeklyHours: {
    [key: string]: {
      enabled: boolean;
      allDay: boolean;
      startTime: string;
      endTime: string;
    };
  };

  // CSAT tab
  enableCSAT: boolean;
  displayType: 'emoji' | 'star';
  csatMessage: string;
  surveyRule: {
    condition: string;
    labels: string[];
  };

  // Configuration tab
  webhookVerificationToken: string;
  apiKey: string;

  // Bot Configuration tab
  selectedBot: string;
}

export interface InboxConfigSectionProps {
  inboxId: string;
  inboxDetails?: any;
  onBack: () => void;
}
