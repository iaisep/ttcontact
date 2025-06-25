import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { WebsiteConfigData } from '../WebsiteConfigTypes';

interface WebsiteWidgetBuilderTabProps {
  configData: WebsiteConfigData;
  updateConfigData: (field: keyof WebsiteConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const WebsiteWidgetBuilderTab: React.FC<WebsiteWidgetBuilderTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      // You can handle the file upload here
      // For now, we'll just store the file name
      updateConfigData('channelAvatar', file.name);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left Column - Configuration */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="website-avatar">Website Avatar</Label>
              <div className="mt-1 flex items-center space-x-2">
                <Input
                  id="website-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <span className="text-sm text-gray-500">
                  {configData.channelAvatar ? `Selected: ${configData.channelAvatar}` : 'Ningun archivo seleccionado'}
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="website-name-builder">Website Name</Label>
              <Input
                id="website-name-builder"
                value={configData.websiteName}
                onChange={(e) => updateConfigData('websiteName', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="welcome-heading-builder">Welcome Heading</Label>
              <Input
                id="welcome-heading-builder"
                value={configData.welcomeHeading}
                onChange={(e) => updateConfigData('welcomeHeading', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="welcome-tagline-builder">Welcome Tagline</Label>
              <textarea
                id="welcome-tagline-builder"
                value={configData.welcomeTagline}
                onChange={(e) => updateConfigData('welcomeTagline', e.target.value)}
                className="mt-1 w-full p-2 border rounded"
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">0 / 255</p>
            </div>

            <div>
              <Label htmlFor="reply-time-builder">Reply Time</Label>
              <Select 
                value={configData.setReplyTime} 
                onValueChange={(value) => updateConfigData('setReplyTime', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In a few minutes">In a few minutes</SelectItem>
                  <SelectItem value="In an hour">In an hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="widget-color-builder">Widget Color</Label>
              <div className="mt-1 flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: configData.widgetColor }}
                ></div>
              </div>
            </div>

            <div>
              <Label>Widget Bubble Position</Label>
              <div className="mt-2 flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="position"
                    value="left"
                    checked={configData.widgetBubblePosition === 'left'}
                    onChange={(e) => updateConfigData('widgetBubblePosition', e.target.value)}
                    className="mr-2"
                  />
                  Left
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="position"
                    value="right"
                    checked={configData.widgetBubblePosition === 'right'}
                    onChange={(e) => updateConfigData('widgetBubblePosition', e.target.value)}
                    className="mr-2"
                  />
                  Right
                </label>
              </div>
            </div>

            <div>
              <Label>Widget Bubble Type</Label>
              <div className="mt-2 flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="bubbleType"
                    value="standard"
                    checked={configData.widgetBubbleType === 'standard'}
                    onChange={(e) => updateConfigData('widgetBubbleType', e.target.value)}
                    className="mr-2"
                  />
                  Standard
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="bubbleType"
                    value="expanded"
                    checked={configData.widgetBubbleType === 'expanded'}
                    onChange={(e) => updateConfigData('widgetBubbleType', e.target.value)}
                    className="mr-2"
                  />
                  Expanded Bubble
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="widget-bubble-launcher-title">Widget Bubble Launcher Title</Label>
              <Input
                id="widget-bubble-launcher-title"
                value={configData.widgetBubbleLauncherTitle}
                onChange={(e) => updateConfigData('widgetBubbleLauncherTitle', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button onClick={onSave} disabled={saving}>
              {saving ? 'Update Widget Settings...' : 'Update Widget Settings'}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input type="radio" name="preview" value="preview" defaultChecked className="mr-2" />
              Preview
            </label>
            <label className="flex items-center">
              <input type="radio" name="preview" value="script" className="mr-2" />
              Script
            </label>
          </div>
          
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input type="radio" name="mode" value="default" defaultChecked className="mr-2" />
              Default
            </label>
            <label className="flex items-center">
              <input type="radio" name="mode" value="chat" className="mr-2" />
              Chat
            </label>
          </div>

          <div className="bg-white rounded-lg p-4 min-h-96 relative">
            <div className="text-center text-blue-500 text-sm">
              {configData.websiteName} ●
              <br />
              <span className="text-xs text-gray-500">Typically replies in a few minutes</span>
            </div>
            
            <div className="absolute bottom-4 right-4">
              <div className="bg-gray-200 rounded-full p-2 text-sm">
                We are Online
                <br />
                <span className="text-xs">Typically replies in a few hours</span>
                <br />
                <span className="text-blue-500 text-xs cursor-pointer">Start Conversation →</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <div className="bg-blue-500 rounded-full p-3 text-white">
                ✕
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteWidgetBuilderTab;
