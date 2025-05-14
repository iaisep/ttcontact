
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from '@/context/LanguageContext';
import { useVoiceModal } from './VoiceModalContext';

const TermsCheckbox: React.FC = () => {
  const { t } = useLanguage();
  const { termsAccepted, setTermsAccepted } = useVoiceModal();

  return (
    <div className="flex items-start space-x-2 mb-2">
      <Checkbox 
        id="terms" 
        checked={termsAccepted} 
        onCheckedChange={(checked) => setTermsAccepted(!!checked)}
        className="mt-1"
      />
      <div className="max-w-[360px] overflow-hidden">
        <label htmlFor="terms" className="text-xs leading-tight inline-block cursor-pointer">
          {t('i_hereby_confirm_that_i_have_all_necessary_rights_or_consents_to_upload_and_clone_these_voice_samples_and_that_i_will_not_use_the_platform_generated_content_for_any_illegal_fraudulent_or_harmful_purpose') || 
          'I hereby confirm that I have all necessary rights or consents to upload and clone these voice samples and that I will not use the platform-generated content for any illegal, fraudulent, or harmful purpose.'}
        </label>
      </div>
    </div>
  );
};

export default TermsCheckbox;
