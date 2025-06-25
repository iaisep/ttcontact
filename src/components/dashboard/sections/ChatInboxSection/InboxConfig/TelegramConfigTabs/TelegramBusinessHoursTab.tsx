
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TelegramConfigData } from '../TelegramConfigTypes';

interface TelegramBusinessHoursTabProps {
  configData: TelegramConfigData;
  updateConfigData: (field: keyof TelegramConfigData, value: any) => void;
  updateWeeklyHours: (day: string, hours: any) => void;
  saving: boolean;
  onSave: () => void;
}

const TelegramBusinessHoursTab: React.FC<TelegramBusinessHoursTabProps> = ({
  configData,
  updateConfigData,
  updateWeeklyHours,
  saving,
  onSave
}) => {
  const days = [
    { key: 'sunday', label: 'Sunday' },
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Business availability</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Configure the time window when your inbox is online
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="business-availability">Enable business availability</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set up chat availability for your inbox
              </p>
            </div>
            <Switch
              id="business-availability"
              checked={configData.enableBusinessAvailability}
              onCheckedChange={(checked) => updateConfigData('enableBusinessAvailability', checked)}
            />
          </div>

          {configData.enableBusinessAvailability && (
            <>
              <div>
                <Label htmlFor="unavailable-message">Message to show when not available</Label>
                <Input
                  id="unavailable-message"
                  value={configData.unavailableMessage}
                  onChange={(e) => updateConfigData('unavailableMessage', e.target.value)}
                  placeholder="We are unavailable at the moment. Please leave a message and we'll get back to you."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={configData.timezone} 
                  onValueChange={(value) => updateConfigData('timezone', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pacific Time (US & Canada) (GMT-07:00)">Pacific Time (US & Canada) (GMT-07:00)</SelectItem>
                    <SelectItem value="Eastern Time (US & Canada) (GMT-04:00)">Eastern Time (US & Canada) (GMT-04:00)</SelectItem>
                    <SelectItem value="Central Time (US & Canada) (GMT-05:00)">Central Time (US & Canada) (GMT-05:00)</SelectItem>
                    <SelectItem value="Mountain Time (US & Canada) (GMT-06:00)">Mountain Time (US & Canada) (GMT-06:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Weekly working hours</Label>
                <div className="mt-2 space-y-4">
                  {days.map((day) => {
                    const dayHours = configData.weeklyHours[day.key];
                    return (
                      <div key={day.key} className="flex items-center space-x-4 p-3 border rounded">
                        <div className="w-20">
                          <span className="text-sm font-medium">{day.label}</span>
                        </div>
                        <Switch
                          checked={dayHours.enabled}
                          onCheckedChange={(checked) => 
                            updateWeeklyHours(day.key, { ...dayHours, enabled: checked })
                          }
                        />
                        {dayHours.enabled && (
                          <>
                            <Switch
                              checked={dayHours.allDay}
                              onCheckedChange={(checked) => 
                                updateWeeklyHours(day.key, { ...dayHours, allDay: checked })
                              }
                            />
                            <span className="text-sm">All day</span>
                            {!dayHours.allDay && (
                              <>
                                <Input
                                  type="time"
                                  value={dayHours.startTime}
                                  onChange={(e) => 
                                    updateWeeklyHours(day.key, { ...dayHours, startTime: e.target.value })
                                  }
                                  className="w-32"
                                />
                                <span className="text-sm">to</span>
                                <Input
                                  type="time"
                                  value={dayHours.endTime}
                                  onChange={(e) => 
                                    updateWeeklyHours(day.key, { ...dayHours, endTime: e.target.value })
                                  }
                                  className="w-32"
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
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

export default TelegramBusinessHoursTab;
