
export interface WebsiteConfigData {
  // Settings tab
  inboxName: string;
  channelAvatar: string;
  websiteName: string;
  websiteDomain: string;
  welcomeHeading: string;
  welcomeTagline: string;
  widgetColor: string;
  enableChannelGreeting: boolean;
  setReplyTime: string;
  enableEmailCollectBox: boolean;
  allowMessagesAfterResolved: boolean;
  enableConversationContinuity: boolean;
  helpCenter: string;
  features: {
    displayFilePicker: boolean;
    displayEmojiPicker: boolean;
    allowUsersToEndConversation: boolean;
    useInboxNameAndAvatar: boolean;
  };
  senderName: {
    type: 'friendly' | 'professional';
    friendlyName: string;
    professionalName: string;
  };

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

  // Pre Chat Form tab
  enablePreChatForm: boolean;
  preChatMessage: string;
  preFormFields: Array<{
    key: string;
    type: string;
    required: boolean;
    label: string;
    placeholder: string;
    enabled: boolean;
  }>;

  // Widget Builder tab
  widgetBubblePosition: 'left' | 'right';
  widgetBubbleType: 'standard' | 'expanded';
  widgetBubbleLauncherTitle: string;

  // Configuration tab
  messengerScript: string;
  userIdentityValidation: string;
  enforceUserIdentityValidation: boolean;

  // Bot Configuration tab
  selectedBot: string;
}

export interface WebsiteConfigSectionProps {
  inboxId: string;
  onBack: () => void;
}
