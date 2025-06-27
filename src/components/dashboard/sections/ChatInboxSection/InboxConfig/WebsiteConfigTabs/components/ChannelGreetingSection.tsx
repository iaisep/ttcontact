
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, List, ListOrdered, Code } from 'lucide-react';
import type { WebsiteConfigData } from '../../WebsiteConfigTypes';

interface ChannelGreetingSectionProps {
  configData: WebsiteConfigData;
  updateConfigData: (field: keyof WebsiteConfigData, value: any) => void;
}

const ChannelGreetingSection: React.FC<ChannelGreetingSectionProps> = ({
  configData,
  updateConfigData
}) => {
  const handleGreetingMessageChange = (value: string) => {
    updateConfigData('greetingMessage', value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="enable-channel-greeting">Enable channel greeting</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Auto-send greeting messages when customers start a conversation and send their first message.
          </p>
        </div>
        <Switch
          id="enable-channel-greeting"
          checked={configData.enableChannelGreeting}
          onCheckedChange={(checked) => updateConfigData('enableChannelGreeting', checked)}
        />
      </div>

      {configData.enableChannelGreeting && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b pb-2">
              <Button variant="ghost" size="sm" className="p-1">
                <Bold size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <Italic size={16} />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <Button variant="ghost" size="sm" className="p-1">
                <List size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <ListOrdered size={16} />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <Button variant="ghost" size="sm" className="p-1">
                <Code size={16} />
              </Button>
            </div>
            <Textarea
              value={configData.greetingMessage || ''}
              onChange={(e) => handleGreetingMessageChange(e.target.value)}
              className="min-h-[80px] border-0 bg-transparent resize-none focus:ring-0"
              placeholder="Enter greeting message..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelGreetingSection;
