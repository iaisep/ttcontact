
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DraggableFormFieldsList from './components/DraggableFormFieldsList';
import type { WebsiteConfigData } from '../WebsiteConfigTypes';

interface WebsitePreChatFormTabProps {
  configData: WebsiteConfigData;
  updateConfigData: (field: keyof WebsiteConfigData, value: any) => void;
  updatePreFormField: (index: number, field: any) => void;
  saving: boolean;
  onSave: () => void;
}

const WebsitePreChatFormTab: React.FC<WebsitePreChatFormTabProps> = ({
  configData,
  updateConfigData,
  updatePreFormField,
  saving,
  onSave
}) => {
  const handleReorderFields = (newFields: any[]) => {
    updateConfigData('preFormFields', newFields);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Pre chat forms enable you to capture user information before they start conversation with you.
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="enable-pre-chat-form">Enable pre chat form</Label>
            <Select 
              value={configData.enablePreChatForm ? "Yes" : "No"} 
              onValueChange={(value) => updateConfigData('enablePreChatForm', value === "Yes")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {configData.enablePreChatForm && (
            <>
              <div>
                <Label htmlFor="pre-chat-message">Pre chat message</Label>
                <Textarea
                  id="pre-chat-message"
                  value={configData.preChatMessage}
                  onChange={(e) => updateConfigData('preChatMessage', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Pre chat form fields</Label>
                <div className="mt-2">
                  <DraggableFormFieldsList
                    fields={configData.preFormFields}
                    updatePreFormField={updatePreFormField}
                    onReorderFields={handleReorderFields}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Update Pre Chat Form Settings...' : 'Update Pre Chat Form Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreChatFormTab;
