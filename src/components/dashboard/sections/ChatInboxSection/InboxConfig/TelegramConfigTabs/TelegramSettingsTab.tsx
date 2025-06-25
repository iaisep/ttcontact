
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';
import type { TelegramConfigData } from '../TelegramConfigTypes';

interface TelegramSettingsTabProps {
  configData: TelegramConfigData;
  updateConfigData: (field: keyof TelegramConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const TelegramSettingsTab: React.FC<TelegramSettingsTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  const [greetingMessage, setGreetingMessage] = useState('Acme Inc typically replies in a few hours.');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      updateConfigData('channelAvatar', file.name);
    }
  };

  const formatText = (format: string) => {
    // Placeholder for text formatting functionality
    console.log(`Formatting text with: ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Inbox Settings</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Update your inbox settings
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="channel-avatar">Channel Avatar</Label>
            <div className="mt-2 flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Seleccionar archivo
              </Button>
              <span className="text-sm text-gray-500">Ningún archivo seleccionado</span>
            </div>
          </div>

          <div>
            <Label htmlFor="inbox-name">Inbox Name</Label>
            <Input
              id="inbox-name"
              value={configData.inboxName}
              onChange={(e) => updateConfigData('inboxName', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="channel-greeting">Enable channel greeting</Label>
            <Select 
              value={configData.greetingType} 
              onValueChange={(value) => updateConfigData('greetingType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select greeting option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="enabled">Enabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Auto-send greeting messages when customers start a conversation and send their first message.
            </p>

            {/* Rich Text Editor - Only shown when greeting is enabled */}
            {configData.greetingType === 'enabled' && (
              <div className="mt-4 border rounded-lg">
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('bold')}
                    className="h-8 w-8 p-0"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('italic')}
                    className="h-8 w-8 p-0"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('bulletList')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('orderedList')}
                    className="h-8 w-8 p-0"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('undo')}
                    className="h-8 w-8 p-0"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('redo')}
                    className="h-8 w-8 p-0"
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Text Area */}
                <Textarea
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  placeholder="Enter your greeting message..."
                  className="border-0 resize-none focus:ring-0 rounded-t-none min-h-[120px]"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="help-center">Help Center</Label>
            <Select value={configData.helpCenter} onValueChange={(value) => updateConfigData('helpCenter', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Help Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select Help Center</SelectItem>
                <SelectItem value="default">Default Help Center</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Attach a Help Center with the inbox
            </p>
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

export default TelegramSettingsTab;
