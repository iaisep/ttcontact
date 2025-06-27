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

  // Get the actual inbox ID from URL if not provided as prop
  const getInboxId = (): number => {
    if (inboxId && !isNaN(inboxId)) {
      return inboxId;
    }
    
    // Extract inbox ID from URL path
    const pathParts = window.location.pathname.split('/');
    const urlInboxId = pathParts[pathParts.length - 1];
    const parsedId = parseInt(urlInboxId);
    
    console.log('Extracting inbox ID:', {
      inboxIdProp: inboxId,
      urlInboxId,
      parsedId,
      isValidParsedId: !isNaN(parsedId)
    });
    
    return !isNaN(parsedId) ? parsedId : 0;
  };

  const actualInboxId = getInboxId();

  // Debug logs to check the state
  console.log('TelegramBotConfigTab - Debug:', {
    inboxIdProp: inboxId,
    actualInboxId,
    selectedBot: configData.selectedBot,
    setBotLoading,
    availableBots: availableBots.length
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
    // Get the selected bot data first
    const selectedBotData = availableBots.find(bot => bot.name === configData.selectedBot);
    
    if (!configData.selectedBot || !selectedBotData) {
      console.error('No bot selected or bot not found', {
        selectedBot: configData.selectedBot,
        availableBots: availableBots.map(bot => bot.name)
      });
      setError('Please select a valid bot');
      return;
    }

    if (!actualInboxId || actualInboxId === 0) {
      console.error('Valid inbox ID is required', { actualInboxId, inboxIdProp: inboxId });
      setError('Unable to determine inbox ID. Please reload the page.');
      return;
    }

    // Use the bot ID from the selected bot data
    const botId = selectedBotData.id;
    
    console.log('Setting agent bot with details:', {
      selectedBotName: configData.selectedBot,
      botId: botId,
      selectedBotData,
      actualInboxId,
      originalInboxId: inboxId
    });

    try {
      setSetBotLoading(true);
      setError(null);
      
      console.log('Setting agent bot for Telegram inbox:', { 
        botId,
        selectedBot: configData.selectedBot,
        agentBotId: botId,
        inboxId: actualInboxId 
      });
      
      // Make the API call to set the agent bot
      const response = await fetch(`https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/inboxes/${actualInboxId}/set_agent_bot`, {
        method: 'POST',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'content-type': 'application/json',
          'api_access_token': 'YZEKfqAJsnEWoshpdRCq9yZn'
        },
        body: JSON.stringify({
          agent_bot: botId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to set agent bot: ${response.status} - ${errorText}`);
      }
      
      console.log('Telegram agent bot configuration completed successfully');
      
    } catch (err) {
      console.error('Failed to set agent bot:', err);
      setError('Failed to set agent bot. Please try again.');
    } finally {
      setSetBotLoading(false);
    }
  };

  // Button should only be disabled when loading or if we don't have a valid inbox ID
  const isButtonDisabled = setBotLoading || !actualInboxId || actualInboxId === 0;
  
  console.log('Button disabled check:', {
    setBotLoading,
    actualInboxId,
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

        {!actualInboxId && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Unable to determine inbox ID. Please reload the page or go back and try again.
            </p>
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
                  Click "Set Agent Bot" to configure this bot for the inbox
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
