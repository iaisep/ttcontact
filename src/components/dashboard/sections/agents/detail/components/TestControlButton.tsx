
import React from 'react';
import { Button } from '@/components/ui/button';
import { Square } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TestControlButtonProps {
  isRecording: boolean;
  isLoading: boolean;
  onTest: () => void;
}

const TestControlButton: React.FC<TestControlButtonProps> = ({
  isRecording,
  isLoading,
  onTest
}) => {
  const { t } = useLanguage();
  
  if (isRecording) {
    return (
      <Button 
        onClick={onTest}
        variant="outline"
        className="w-40 bg-white text-red-500 border-red-500 hover:bg-red-50"
      >
        <Square className="mr-2 h-4 w-4" />
        {t('end_the_call')}
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={onTest}
      variant="default"
      disabled={isLoading}
    >
      {t('test')}
    </Button>
  );
};

export default TestControlButton;
