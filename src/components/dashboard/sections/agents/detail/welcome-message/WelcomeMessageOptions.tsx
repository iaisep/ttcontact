
import { useLanguage } from '@/context/LanguageContext';

// Define the welcome message options as constants
export const WELCOME_MESSAGE_OPTIONS = {
  USER_INITIATES: 'User initiates: AI remains silent until users speak first.',
  AI_INITIATES_DYNAMIC: 'AI initiates: AI begins with a dynamic begin message.',
  AI_INITIATES_CUSTOM: 'AI initiates: AI begins with your defined begin message.',
};

interface WelcomeMessageOptionsProps {
  selectedOption: string;
  handleSelectChange: (value: string) => void;
  isLoading: boolean;
}

const WelcomeMessageOptions: React.FC<WelcomeMessageOptionsProps> = ({
  selectedOption,
  handleSelectChange,
  isLoading,
}) => {
  const { t } = useLanguage();

  return (
    <Select 
      value={selectedOption} 
      onValueChange={handleSelectChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a welcome message type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={WELCOME_MESSAGE_OPTIONS.USER_INITIATES}>
          {WELCOME_MESSAGE_OPTIONS.USER_INITIATES}
        </SelectItem>
        <SelectItem value={WELCOME_MESSAGE_OPTIONS.AI_INITIATES_DYNAMIC}>
          {WELCOME_MESSAGE_OPTIONS.AI_INITIATES_DYNAMIC}
        </SelectItem>
        <SelectItem value={WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM}>
          {WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default WelcomeMessageOptions;

// Need to import these at the top
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
