
export interface WebsiteConfigData {
  // Settings
  websiteName: string;
  websiteUrl: string;
  channelAvatar: string;
  enableChannelGreeting: boolean;
  greetingType: 'disabled' | 'custom';
  greetingMessage: string;
  helpCenter: string;

  // Additional widget settings
  welcomeHeading: string;
  welcomeTagline: string;
  setReplyTime: string;
  enableEmailCollectBox: boolean;
  allowMessagesAfterResolved: boolean;
  enableConversationContinuity: boolean;

  // Features
  features: {
    enableFileUpload: boolean;
    enableConversationNoteEmail: boolean;
    enableCSATSubtitle: boolean;
    enableTypingIndicator: boolean;
    enableBusinessHours: boolean;
    enableCSAT: boolean;
    enablePreChatForm: boolean;
    enablePreChatMessage: boolean;
    enableReplyTime: boolean;
    enableConversationContinuity: boolean;
    enableContactInformation: boolean;
    enableEmailCollect: boolean;
    enablePhoneNumberCollect: boolean;
    enableFullNameCollect: boolean;
  };

  // Pre Chat Form
  preChatFormEnabled: boolean;
  enablePreChatForm: boolean;
  preChatMessage: string;
  requireEmail: boolean;
  requireFullName: boolean;
  requirePhoneNumber: boolean;
  preChatFormFields: Array<{
    name: string;
    placeholder: string;
    type: string;
    required: boolean;
    enabled: boolean;
    field_type: string;
    label: string;
    values: any[];
  }>;

  // Agents/Collaborators
  agents: string[];
  enableAutoAssignment: boolean;
  autoAssignmentLimit: number;

  // Business Hours  
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

  // CSAT
  enableCSAT: boolean;
  displayType: 'emoji' | 'thumbs';
  csatMessage: string;
  surveyRule: {
    condition: string;
    labels: string[];
  };

  // Appearance/Widget Builder
  widgetColor: string;
  position: 'left' | 'right';
  launcherTitle: string;
  widgetStyle: 'standard' | 'expanded_bubble';
  widgetBubblePosition: 'left' | 'right';
  widgetBubbleType: 'standard' | 'expanded';
  widgetBubbleLauncherTitle: string;

  // Configuration
  userIdentityValidation: string;
  enforceUserIdentityValidation: boolean;

  // Sender Names
  senderNames: Array<{
    name: string;
    email: string;
  }>;

  // Bot Configuration
  selectedBot?: string;
}

export interface WebsiteConfigSectionProps {
  inboxId: string;
  onBack: () => void;
}
