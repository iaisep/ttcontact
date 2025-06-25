
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TelegramConfigData } from '../TelegramConfigTypes';

interface TelegramCSATTabProps {
  configData: TelegramConfigData;
  updateConfigData: (field: keyof TelegramConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const TelegramCSATTab: React.FC<TelegramCSATTabProps> = ({
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
          Collect customer satisfaction ratings after conversations
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-csat">Enable CSAT</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable customer satisfaction survey for this inbox
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
                <Label htmlFor="display-type">CSAT Display Type</Label>
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Choose how the CSAT survey will be displayed to customers
                </p>
              </div>

              <div>
                <Label htmlFor="csat-message">CSAT Survey Message</Label>
                <Input
                  id="csat-message"
                  value={configData.csatMessage}
                  onChange={(e) => updateConfigData('csatMessage', e.target.value)}
                  placeholder="Please rate your experience with our support"
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Message to show with the CSAT survey
                </p>
              </div>

              <div>
                <Label>Survey Rule</Label>
                <div className="mt-2 space-y-4">
                  <div>
                    <Label htmlFor="survey-condition">Condition</Label>
                    <Select 
                      value={configData.surveyRule.condition} 
                      onValueChange={(value) => 
                        updateConfigData('surveyRule', { ...configData.surveyRule, condition: value })
                      }
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
                      onChange={(e) => 
                        updateConfigData('surveyRule', { 
                          ...configData.surveyRule, 
                          labels: e.target.value.split(',').map(label => label.trim()).filter(Boolean)
                        })
                      }
                      placeholder="Enter labels separated by commas"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Labels to trigger the CSAT survey
                    </p>
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

export default TelegramCSATTab;
