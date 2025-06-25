
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { WebsiteFormData, FormErrors } from './types';

interface WebsiteFormFieldsProps {
  formData: WebsiteFormData;
  errors: FormErrors;
  onInputChange: (field: keyof WebsiteFormData, value: string | boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

const WebsiteFormFields: React.FC<WebsiteFormFieldsProps> = ({
  formData,
  errors,
  onInputChange,
  onBack,
  onNext
}) => {
  const isFormValid = formData.websiteName.trim() && formData.websiteDomain.trim();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Website channel</h2>
        <p className="text-gray-600 mb-6">
          Create a channel for your website and start supporting your customers via our website widget.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="websiteName">Website Name *</Label>
          <Input
            id="websiteName"
            type="text"
            placeholder="Enter your website name (eg: Acme Inc)"
            value={formData.websiteName}
            onChange={(e) => onInputChange('websiteName', e.target.value)}
            className={errors.websiteName ? 'border-red-500' : ''}
          />
          {errors.websiteName && (
            <p className="text-red-500 text-sm mt-1">{errors.websiteName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="websiteDomain">Website Domain *</Label>
          <Input
            id="websiteDomain"
            type="text"
            placeholder="Enter your website domain (eg: acme.com)"
            value={formData.websiteDomain}
            onChange={(e) => onInputChange('websiteDomain', e.target.value)}
            className={errors.websiteDomain ? 'border-red-500' : ''}
          />
          {errors.websiteDomain && (
            <p className="text-red-500 text-sm mt-1">{errors.websiteDomain}</p>
          )}
        </div>

        <div>
          <Label htmlFor="widgetColor">Widget Color</Label>
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded border"
              style={{ backgroundColor: formData.widgetColor }}
            />
            <Input
              id="widgetColor"
              type="color"
              value={formData.widgetColor}
              onChange={(e) => onInputChange('widgetColor', e.target.value)}
              className="w-20"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="welcomeHeading">Welcome Heading</Label>
          <Input
            id="welcomeHeading"
            type="text"
            value={formData.welcomeHeading}
            onChange={(e) => onInputChange('welcomeHeading', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="welcomeTagline">Welcome Tagline</Label>
          <div className="border rounded-md p-3 min-h-[100px]">
            <textarea
              id="welcomeTagline"
              className="w-full h-full border-none outline-none resize-none"
              value={formData.welcomeTagline}
              onChange={(e) => onInputChange('welcomeTagline', e.target.value)}
              placeholder="Enter your welcome message..."
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {formData.welcomeTagline.length} / 255
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="enableChannelGreeting">Enable channel greeting</Label>
          <Select 
            value={formData.enableChannelGreeting ? 'enabled' : 'disabled'}
            onValueChange={(value) => onInputChange('enableChannelGreeting', value === 'enabled')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="enabled">Enabled</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            Auto-send greeting messages when customers start a conversation and send their first message.
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
          disabled={!isFormValid}
        >
          Create Inbox
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WebsiteFormFields;
