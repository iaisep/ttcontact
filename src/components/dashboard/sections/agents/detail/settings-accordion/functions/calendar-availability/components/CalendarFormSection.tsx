
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CalendarFormSectionProps {
  functionName: string;
  setFunctionName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  eventTypeId: string;
  setEventTypeId: (id: string) => void;
  timezone: string;
  setTimezone: (tz: string) => void;
}

const CalendarFormSection: React.FC<CalendarFormSectionProps> = ({
  functionName,
  setFunctionName,
  description,
  setDescription,
  apiKey,
  setApiKey,
  eventTypeId,
  setEventTypeId,
  timezone,
  setTimezone,
}) => {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="functionName">Name</Label>
        <Input
          id="functionName"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-gray-400 text-xs">(Optional)</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key (Cal.com)</Label>
        <Input
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter Cal.com API key"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eventTypeId">Event Type ID (Cal.com)</Label>
        <Input
          id="eventTypeId"
          value={eventTypeId}
          onChange={(e) => setEventTypeId(e.target.value)}
          placeholder="Enter Event Type ID"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timezone">
          Timezone <span className="text-gray-400 text-xs">(Optional)</span>
        </Label>
        <Input
          id="timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          placeholder="America/Los_Angeles"
        />
      </div>
    </div>
  );
};

export default CalendarFormSection;
