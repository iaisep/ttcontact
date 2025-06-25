
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, X, Send } from 'lucide-react';
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
  const [previewMode, setPreviewMode] = useState<'preview' | 'script'>('preview');
  const [chatState, setChatState] = useState<'default' | 'chat'>('default');
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      updateConfigData('channelAvatar', file.name);
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfigData('widgetColor', event.target.value);
  };

  const renderPreview = () => {
    if (previewMode === 'script') {
      return (
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-auto">
          <div className="text-gray-500">{'<script>'}</div>
          <div className="ml-2">
            <div>window.chatwootSettings = {'{'}</div>
            <div className="ml-2">
              <div>position: "right",</div>
              <div>type: "standard",</div>
              <div>launcherTitle: "{configData.widgetBubbleLauncherTitle}",</div>
              <div>color: "{configData.widgetColor}"</div>
            </div>
            <div>{'}'}</div>
            <div>var s = document.createElement("script");</div>
            <div>s.src = "https://app.chatwoot.com/packs/js/sdk.js";</div>
            <div>s.async = true;</div>
            <div>document.head.appendChild(s);</div>
          </div>
          <div className="text-gray-500">{'</script>'}</div>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 rounded-lg p-4 min-h-96 relative">
        {/* Widget when closed */}
        {!isWidgetOpen && (
          <div 
            className={`absolute bottom-6 ${configData.widgetBubblePosition === 'left' ? 'left-4' : 'right-4'}`}
          >
            {configData.widgetBubbleType === 'expanded' ? (
              <div 
                className="bg-white rounded-lg shadow-lg p-3 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setIsWidgetOpen(true)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: configData.widgetColor }}
                  >
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">We are Online</div>
                    <div className="text-xs text-gray-500">{configData.setReplyTime}</div>
                    <div className="text-xs text-blue-500">Start Conversation →</div>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: configData.widgetColor }}
                onClick={() => setIsWidgetOpen(true)}
              >
                <MessageCircle size={24} />
              </div>
            )}
          </div>
        )}

        {/* Widget when open */}
        {isWidgetOpen && (
          <div 
            className={`absolute bottom-6 ${configData.widgetBubblePosition === 'left' ? 'left-4' : 'right-4'} w-80`}
          >
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Header */}
              <div 
                className="p-4 text-white flex items-center justify-between"
                style={{ backgroundColor: configData.widgetColor }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <div className="font-medium">{configData.websiteName}</div>
                    <div className="text-xs opacity-90">{configData.setReplyTime}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsWidgetOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 h-64 overflow-y-auto">
                {chatState === 'default' ? (
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900 mb-2">
                      {configData.welcomeHeading}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {configData.welcomeTagline}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <div className="text-sm text-gray-800">Hello</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    className="p-2 rounded-lg text-white"
                    style={{ backgroundColor: configData.widgetColor }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-500 text-center">
                  Powered by Chatwoot
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
                <Input
                  id="widget-color-builder"
                  type="color"
                  value={configData.widgetColor}
                  onChange={handleColorChange}
                  className="w-16 h-8 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-500">{configData.widgetColor}</span>
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
              <input 
                type="radio" 
                name="preview" 
                value="preview" 
                checked={previewMode === 'preview'}
                onChange={(e) => setPreviewMode('preview')}
                className="mr-2" 
              />
              Preview
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="preview" 
                value="script" 
                checked={previewMode === 'script'}
                onChange={(e) => setPreviewMode('script')}
                className="mr-2" 
              />
              Script
            </label>
          </div>
          
          {previewMode === 'preview' && (
            <div className="flex space-x-4 mb-6">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="mode" 
                  value="default" 
                  checked={chatState === 'default'}
                  onChange={(e) => setChatState('default')}
                  className="mr-2" 
                />
                Default
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="mode" 
                  value="chat" 
                  checked={chatState === 'chat'}
                  onChange={(e) => setChatState('chat')}
                  className="mr-2" 
                />
                Chat
              </label>
            </div>
          )}

          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default WebsiteWidgetBuilderTab;
