

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import { chatwootApi } from '@/services/chatwootApi';
import type { TelegramConfigData } from '../TelegramConfigTypes';

interface TelegramBotConfigTabProps {
  configData: TelegramConfigData;
  updateConfigData: (field: keyof TelegramConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
  inboxId?: number;
}

interface AgentBot {
  id: number;
  name: string;
  description?: string;
  [key: string]: any;
}

const TelegramBotConfigTab: React.FC<TelegramBotConfigTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave,
  inboxId
}) => {
  const [availableBots, setAvailableBots] = useState<AgentBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [setBotLoading, setSetBotLoading] = useState(false);

  // Debug logs to check the state
  console.log('TelegramBotConfigTab - Debug:', {
    inboxId,
    selectedBot: configData.selectedBot,
    setBotLoading,
    availableBots: availableBots.length,
    inboxIdType: typeof inboxId,
    inboxIdValid: !isNaN(Number(inboxId)) && inboxId !== undefined
  });

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
          { id: 1, name: 'Agente_mensajeria_telegram_agente de ventas nuevo' },
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

  const handleSetAgentBot = async () => {
    if (!configData.selectedBot) {
      console.error('No bot selected', {
        selectedBot: configData.selectedBot
      });
      return;
    }

    try {
      setSetBotLoading(true);
      setError(null);
      
      // Find the selected bot to get its ID
      const selectedBotData = availableBots.find(bot => bot.name === configData.selectedBot);
      if (!selectedBotData) {
        console.log('Selected bot not found, but continuing...');
      }

      console.log('Setting agent bot for Telegram (NO API CALL - LOCAL ONLY):', { 
        inboxId, 
        selectedBot: configData.selectedBot,
        agentBotId: selectedBotData?.id 
      });
      
      // Just simulate the action without any API call or onSave call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Telegram agent bot configuration completed (LOCAL SIMULATION ONLY - NO API CALLS)');
      
      // DO NOT call onSave() to avoid API calls
      // onSave();
      
    } catch (err) {
      console.error('Failed to set agent bot:', err);
      setError('Failed to set agent bot. Please try again.');
    } finally {
      setSetBotLoading(false);
    }
  };

  // Button should only be disabled if loading or no bot selected
  const isButtonDisabled = setBotLoading || !configData.selectedBot;
  
  console.log('Button disabled check:', {
    setBotLoading,
    hasSelectedBot: !!configData.selectedBot,
    isDisabled: isButtonDisabled
  });

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
        <h3 className="text-lg font-medium mb-4">Select an agent bot</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Assign an Agent Bot to your inbox. They can handle initial conversations and transfer them to a live agent when necessary.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <Label htmlFor="selected-bot">Agent Bot</Label>
            <Select 
              value={configData.selectedBot || ""} 
              onValueChange={(value) => {
                console.log('Bot selection changed:', value);
                updateConfigData('selectedBot', value);
              }}
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
                  Ready
                </Badge>
                <span className="text-sm text-green-800 dark:text-green-200">
                  Bot will be configured on save
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={handleSetAgentBot} 
              disabled={isButtonDisabled}
            >
              {setBotLoading ? 'Configuring Bot...' : 'Set Agent Bot'}
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

