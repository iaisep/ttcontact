
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import type { TelegramConfigData } from '../TelegramConfigTypes';

interface TelegramCollaboratorsTabProps {
  configData: TelegramConfigData;
  updateConfigData: (field: keyof TelegramConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const TelegramCollaboratorsTab: React.FC<TelegramCollaboratorsTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  const removeAgent = (agentToRemove: string) => {
    const updatedAgents = configData.agents.filter(agent => agent !== agentToRemove);
    updateConfigData('agents', updatedAgents);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Agents</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Add or remove agents from this inbox
        </p>

        <div className="space-y-6">
          <div>
            <Label>Agents</Label>
            <div className="mt-2 space-y-2">
              {configData.agents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <span className="text-sm">{agent}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAgent(agent)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={onSave} disabled={saving} className="mt-4">
              {saving ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Conversation Assignment</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Update conversation assignment settings
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-assignment">Enable auto assignment</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable or disable the automatic assignment of new conversations to the agents added to this inbox.
                </p>
              </div>
              <Switch
                id="auto-assignment"
                checked={configData.enableAutoAssignment}
                onCheckedChange={(checked) => updateConfigData('enableAutoAssignment', checked)}
              />
            </div>

            {configData.enableAutoAssignment && (
              <div>
                <Label htmlFor="assignment-limit">Auto assignment limit</Label>
                <Input
                  id="assignment-limit"
                  type="number"
                  value={configData.autoAssignmentLimit}
                  onChange={(e) => updateConfigData('autoAssignmentLimit', parseInt(e.target.value) || 0)}
                  className="mt-1"
                  min="1"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Limit the maximum number of conversations from this inbox that can be auto assigned to an agent
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button onClick={onSave} disabled={saving}>
              {saving ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramCollaboratorsTab;
