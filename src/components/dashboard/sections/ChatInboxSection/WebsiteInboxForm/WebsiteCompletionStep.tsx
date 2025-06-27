
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, Check } from 'lucide-react';
import type { WebsiteFormData } from './types';

interface WebsiteCompletionStepProps {
  formData: WebsiteFormData;
  selectedAgents: string[];
  generatedScript: string;
  isCreating: boolean;
  onComplete: () => void;
}

const WebsiteCompletionStep: React.FC<WebsiteCompletionStepProps> = ({
  formData,
  selectedAgents,
  generatedScript,
  isCreating,
  onComplete
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy script:', err);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-2">Your Inbox is ready!</h2>
        <p className="text-gray-600 mb-6">
          You have successfully finished creating a website channel. Copy the code shown below and paste it on 
          your website. Next time a customer use the live chat, the conversation will automatically appear on your 
          inbox.
        </p>
      </div>

      {generatedScript && (
        <div className="bg-gray-50 p-4 rounded-lg text-left">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-sm">Installation Script</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyScript}
              className="flex items-center gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
            <code>{generatedScript}</code>
          </pre>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg text-left">
        <h3 className="font-medium mb-2">Inbox Details:</h3>
        <p><strong>Name:</strong> {formData.websiteName}</p>
        <p><strong>Domain:</strong> {formData.websiteDomain}</p>
        <p><strong>Platform:</strong> Website</p>
        <p><strong>Agents:</strong> {selectedAgents.length} assigned</p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline">
          More settings
        </Button>
        <Button 
          onClick={onComplete}
          className="bg-green-600 hover:bg-green-700"
          disabled={isCreating}
        >
          {isCreating ? 'Creating Inbox...' : 'Take me there'}
        </Button>
      </div>
    </div>
  );
};

export default WebsiteCompletionStep;
