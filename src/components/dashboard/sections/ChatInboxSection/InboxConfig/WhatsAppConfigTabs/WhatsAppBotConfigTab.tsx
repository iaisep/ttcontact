
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import { chatwootApi } from '@/services/chatwootApi';
import type { WhatsAppConfigData } from '../types';

interface WhatsAppBotConfigTabProps {
  configData: WhatsAppConfigData;
  updateConfigData: (field: keyof WhatsAppConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

interface AgentBot {
  id: number;
  name: string;
  description?: string;
  [key: string]: any;
}

const WhatsAppBotConfigTab: React.FC<WhatsAppBotConfigTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  const [availableBots, setAvailableBots] = useState<AgentBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentBots = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching agent bots from Chatwoot API...');
        const bots = await chatwootApi.getAgentBots();
        console.log('Agent bots fetched:', bots);
        setAvailableBots(bots);
      } catch (err) {
        console.error('Failed to fetch agent bots:', err);
        setError('Failed to load agent bots. Please try again.');
        // Fallback to mock data if API fails
        setAvailableBots([
          { id: 1, name: 'Agente_mensajeria_telegram_inmensa' },
          { id: 2, name: 'Customer_Support_Bot' },
          { id: 3, name: 'Sales_Assistant_Bot' },
          { id: 4, name: 'Technical_Support_Bot' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentBots();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Bot Configuration</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Configure automated bot responses for this inbox
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

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
                {availableBots.length > 0 ? (
                  availableBots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.name}>
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <span>{bot.name}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-bots" disabled>
                    No bots available
                  </SelectItem>
                )}
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
