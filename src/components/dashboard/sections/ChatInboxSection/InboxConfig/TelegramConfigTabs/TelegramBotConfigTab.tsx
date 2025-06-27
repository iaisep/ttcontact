
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import type { TelegramConfigData } from '../TelegramConfigTypes';

interface TelegramBotConfigTabProps {
  configData: TelegramConfigData;
  updateConfigData: (field: keyof TelegramConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const TelegramBotConfigTab: React.FC<TelegramBotConfigTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  const availableBots = [
    'Agente_mensajeria_telegram_agente de ventas nuevo',
    'Customer_Support_Bot',
    'Sales_Assistant_Bot',
    'Technical_Support_Bot'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Select an agent bot</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Assign an Agent Bot to your inbox. They can handle initial conversations and transfer them to a live agent when necessary.
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="selected-bot">Agent Bot</Label>
            <Select 
              value={configData.selectedBot} 
              onValueChange={(value) => updateConfigData('selectedBot', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a bot for this inbox" />
              </SelectTrigger>
              <SelectContent>
                {availableBots.map((bot) => (
                  <SelectItem key={bot} value={bot}>
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <span>{bot}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {configData.selectedBot && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  Selected Bot: {configData.selectedBot}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Active
                </Badge>
                <span className="text-sm text-green-800 dark:text-green-200">
                  Bot is configured and ready to handle messages
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={onSave} disabled={saving}>
              {saving ? 'Updating...' : 'Update'}
            </Button>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              Disconnect bot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramBotConfigTab;
