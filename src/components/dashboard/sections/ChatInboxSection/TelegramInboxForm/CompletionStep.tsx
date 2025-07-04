
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import type { FormData } from './types';

interface CompletionStepProps {
  formData: FormData;
  selectedAgents: string[];
  isCreating: boolean;
  onComplete: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({
  formData,
  selectedAgents,
  isCreating,
  onComplete
}) => {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-2">Voilà!</h2>
        <p className="text-gray-600 mb-6">
          You are all set to go! Your Telegram inbox will be created when you click the button below.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Inbox Details:</h3>
        <p><strong>Name:</strong> {formData.inboxName}</p>
        <p><strong>Platform:</strong> Telegram</p>
        <p><strong>Agents:</strong> {selectedAgents.length} assigned</p>
      </div>

      <Button 
        onClick={onComplete}
        className="bg-blue-600 hover:bg-blue-700"
        disabled={isCreating}
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Inbox...
          </>
        ) : (
          'Create Inbox & Go to Inboxes'
        )}
      </Button>
    </div>
  );
};

export default CompletionStep;
