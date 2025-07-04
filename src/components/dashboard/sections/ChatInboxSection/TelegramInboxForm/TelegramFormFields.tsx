
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { FormData, FormErrors } from './types';

interface TelegramFormFieldsProps {
  formData: FormData;
  errors: FormErrors;
  isValidating?: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const TelegramFormFields: React.FC<TelegramFormFieldsProps> = ({
  formData,
  errors,
  isValidating = false,
  onInputChange,
  onBack,
  onNext
}) => {
  const isFormValid = formData.inboxName.trim() && formData.botToken.trim();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Telegram Channel</h2>
        <p className="text-gray-600 mb-6">Integrate with Telegram channel and start supporting your customers.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="inboxName">Inbox Name</Label>
          <Input
            id="inboxName"
            value={formData.inboxName}
            onChange={(e) => onInputChange('inboxName', e.target.value)}
            placeholder="Please enter an inbox name"
            className={errors.inboxName ? 'border-red-500' : ''}
          />
          {errors.inboxName && (
            <p className="text-red-500 text-sm mt-1">{errors.inboxName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="botToken">Bot Token</Label>
          <Input
            id="botToken"
            value={formData.botToken}
            onChange={(e) => onInputChange('botToken', e.target.value)}
            placeholder="Bot Token"
            className={errors.botToken ? 'border-red-500' : ''}
          />
          {errors.botToken && (
            <p className="text-red-500 text-sm mt-1">{errors.botToken}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Configure the bot token you have obtained from Telegram BotFather.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!isFormValid || isValidating}
        >
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validating Token...
            </>
          ) : (
            'Create Telegram Channel'
          )}
        </Button>
      </div>
    </div>
  );
};

export default TelegramFormFields;
