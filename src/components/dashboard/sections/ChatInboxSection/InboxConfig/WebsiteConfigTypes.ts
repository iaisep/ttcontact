export interface WebsiteConfigData {
  // Basic settings
  websiteName: string;
  websiteUrl: string;
  websiteDomain: string;
  channelAvatar: string;
  enableChannelGreeting: boolean;
  greetingType: 'disabled' | 'custom';
  greetingMessage: string;
  helpCenter: string;
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
    displayFilePicker: boolean;
    displayEmojiPicker: boolean;
    allowUsersToEndConversation: boolean;
    useInboxNameAndAvatar: boolean;
  };

  // Pre-chat form
  preChatFormEnabled: boolean;
  enablePreChatForm: boolean;
  preChatMessage: string;
  requireEmail: boolean;
  requireFullName: boolean;
  requirePhoneNumber: boolean;
  preChatFormFields: Array<{
    key: string;
    name: string;
    placeholder: string;
    type: string;
    required: boolean;
    enabled: boolean;
    field_type: string;
    label: string;
    values: string[];
  }>;

  // Agents
  agents: string[];
  enableAutoAssignment: boolean;
  autoAssignmentLimit: number;

  // Business hours
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

  // Widget settings
  widgetColor: string;
  position: string;
  launcherTitle: string;
  widgetStyle: string;
  widgetBubblePosition: string;
  widgetBubbleType: string;
  widgetBubbleLauncherTitle: string;
  userIdentityValidation: string;
  enforceUserIdentityValidation: boolean;
  senderNames: Array<{
    name: string;
    email: string;
  }>;
  senderName: {
    type: string;
  };
  selectedBot: string;
}

export interface WebsiteConfigSectionProps {
  inboxId: string | number;
  inboxDetails?: any;
  onBack: () => void;
}
