
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { WebsiteConfigData } from '../../WebsiteConfigTypes';

interface SenderNameSectionProps {
  configData: WebsiteConfigData;
  updateSenderName: (field: keyof WebsiteConfigData['senderName'], value: any) => void;
}

const SenderNameSection: React.FC<SenderNameSectionProps> = ({
  configData,
  updateSenderName
}) => {
  const [showBusinessNameConfig, setShowBusinessNameConfig] = useState(false);
  const [businessName, setBusinessName] = useState('');

  return (
    <div>
      <Label>Sender name</Label>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Select the name of the agent who sent the reply to your customer when they receive emails from your agents.
      </p>
      
      <RadioGroup 
        value={configData.senderName.type} 
        onValueChange={(value) => updateSenderName('type', value)}
        className="grid grid-cols-2 gap-4"
      >
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="friendly" id="friendly" />
            <Label htmlFor="friendly">Friendly</Label>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Add the name of the agent who sent the reply in the sender name to make it friendly.
          </p>
          <div className="space-y-2">
            <Label>For eg:</Label>
            <div className="bg-blue-50 p-2 rounded text-sm">
              <span className="text-blue-600">S</span> {configData.senderName.friendlyName}<br />
              &lt;support@yourbusiness.com&gt;
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="professional" id="professional" />
            <Label htmlFor="professional">Professional</Label>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Use only the configured business name as the sender name in the email header.
          </p>
          <div className="space-y-2">
            <Label>For eg:</Label>
            <div className="bg-blue-50 p-2 rounded text-sm">
              <span className="text-blue-600">C</span> {configData.senderName.professionalName}<br />
              &lt;support@yourbusiness.com&gt;
            </div>
          </div>
        </div>
      </RadioGroup>
      
      <div className="mt-4">
        <Button 
          variant="link" 
          className="text-blue-600 p-0"
          onClick={() => setShowBusinessNameConfig(!showBusinessNameConfig)}
        >
          {showBusinessNameConfig ? '- Hide business name configuration' : '+ Configure your business name'}
        </Button>
      </div>
      
      {showBusinessNameConfig && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div>
            <Label htmlFor="business-name">Enter your business name</Label>
            <Input
              id="business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
              className="mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SenderNameSection;
