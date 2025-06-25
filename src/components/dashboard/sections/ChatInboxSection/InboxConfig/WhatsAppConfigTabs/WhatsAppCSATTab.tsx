
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { WhatsAppConfigData } from '../types';

interface WhatsAppCSATTabProps {
  configData: WhatsAppConfigData;
  updateConfigData: (field: keyof WhatsAppConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const WhatsAppCSATTab: React.FC<WhatsAppCSATTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">CSAT Survey</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Configure customer satisfaction surveys
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-csat">Enable CSAT</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Collect customer satisfaction feedback
              </p>
            </div>
            <Switch
              id="enable-csat"
              checked={configData.enableCSAT}
              onCheckedChange={(checked) => updateConfigData('enableCSAT', checked)}
            />
          </div>

          {configData.enableCSAT && (
            <>
              <div>
                <Label htmlFor="display-type">Display Type</Label>
                <Select 
                  value={configData.displayType} 
                  onValueChange={(value: 'emoji' | 'star') => updateConfigData('displayType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select display type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emoji">Emoji</SelectItem>
                    <SelectItem value="star">Star Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="csat-message">CSAT Message</Label>
                <Textarea
                  id="csat-message"
                  value={configData.csatMessage}
                  onChange={(e) => updateConfigData('csatMessage', e.target.value)}
                  className="mt-1"
                  placeholder="Enter message to show with the survey"
                />
              </div>

              <div>
                <Label>Survey Rule</Label>
                <div className="mt-2 space-y-3">
                  <div>
                    <Label htmlFor="survey-condition">Condition</Label>
                    <Select 
                      value={configData.surveyRule.condition} 
                      onValueChange={(value) => updateConfigData('surveyRule', { ...configData.surveyRule, condition: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="starts_with">Starts with</SelectItem>
                        <SelectItem value="ends_with">Ends with</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="survey-labels">Labels</Label>
                    <Input
                      id="survey-labels"
                      value={configData.surveyRule.labels.join(', ')}
                      onChange={(e) => updateConfigData('surveyRule', { 
                        ...configData.surveyRule, 
                        labels: e.target.value.split(',').map(label => label.trim()).filter(Boolean)
                      })}
                      className="mt-1"
                      placeholder="Enter labels separated by commas"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
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

export default WhatsAppCSATTab;
