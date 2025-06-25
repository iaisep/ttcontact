
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import type { WhatsAppConfigData } from '../types';

interface WhatsAppBotConfigTabProps {
  configData: WhatsAppConfigData;
  updateConfigData: (field: keyof WhatsAppConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const WhatsAppBotConfigTab: React.FC<WhatsAppBotConfigTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  const availableBots = [
    'Agente_mensajeria_telegram_inmensa',
    'Customer_Support_Bot',
    'Sales_Assistant_Bot',
    'Technical_Support_Bot'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Bot Configuration</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Configure automated bot responses for this inbox
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="selected-bot">Select Bot</Label>
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              This bot will handle automated responses in this WhatsApp inbox
            </p>
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

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Bot Features</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Automated responses to common questions</li>
              <li>24/7 customer support availability</li>
              <li>Seamless handoff to human agents when needed</li>
              <li>Multi-language support</li>
              <li>Context-aware conversations</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBotConfigTab;
