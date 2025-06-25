
export interface TelegramConfigData {
  // Settings tab
  inboxName: string;
  channelAvatar: string;
  enableChannelGreeting: boolean;
  greetingType: 'disabled' | 'enabled';
  helpCenter: string;

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

  // Bot Configuration tab
  selectedBot: string;
}

export interface TelegramConfigSectionProps {
  inboxId: string;
  onBack: () => void;
}
