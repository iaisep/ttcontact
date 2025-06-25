
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import type { FormData } from './types';

interface WhatsAppFormFieldsProps {
  formData: FormData;
  errors: { [key: string]: string };
  onInputChange: (field: keyof FormData, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const WhatsAppFormFields: React.FC<WhatsAppFormFieldsProps> = ({
  formData,
  errors,
  onInputChange,
  onBack,
  onNext
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">WhatsApp Channel</h2>
        <p className="text-gray-600 mb-6">Start supporting your customers via WhatsApp.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="apiProvider">API Provider</Label>
          <Select value={formData.apiProvider} onValueChange={(value) => onInputChange('apiProvider', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WhatsApp Cloud">WhatsApp Cloud</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          <Label htmlFor="phoneNumber">Phone number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            placeholder="Please enter the phone number from which message will be sent."
            className={errors.phoneNumber ? 'border-red-500' : ''}
            maxLength={15}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Please enter the phone number from which message will be sent. Only numbers allowed after the + sign.
          </p>
        </div>

        <div>
          <Label htmlFor="phoneNumberId">Phone number ID</Label>
          <Input
            id="phoneNumberId"
            value={formData.phoneNumberId}
            onChange={(e) => onInputChange('phoneNumberId', e.target.value)}
            placeholder="Please enter the Phone number ID obtained from Facebook developer dashboard."
            className={errors.phoneNumberId ? 'border-red-500' : ''}
          />
          {errors.phoneNumberId && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumberId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="businessAccountId">Business Account ID</Label>
          <Input
            id="businessAccountId"
            value={formData.businessAccountId}
            onChange={(e) => onInputChange('businessAccountId', e.target.value)}
            placeholder="Please enter the Business Account ID obtained from Facebook developer dashboard."
            className={errors.businessAccountId ? 'border-red-500' : ''}
          />
          {errors.businessAccountId && (
            <p className="text-red-500 text-sm mt-1">{errors.businessAccountId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="apiKey">API key</Label>
          <Input
            id="apiKey"
            value={formData.apiKey}
            onChange={(e) => onInputChange('apiKey', e.target.value)}
            placeholder="API key"
            className={errors.apiKey ? 'border-red-500' : ''}
          />
          {errors.apiKey && (
            <p className="text-red-500 text-sm mt-1">{errors.apiKey}</p>
          )}
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
        >
          Create WhatsApp Channel
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppFormFields;
