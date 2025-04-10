
export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  created_at: string;
  last_triggered?: string;
}

export interface EventOption {
  id: string;
  name: string;
  description: string;
}

export const eventOptions: EventOption[] = [
  { id: 'call.started', name: 'Call Started', description: 'Triggered when a call begins' },
  { id: 'call.ended', name: 'Call Ended', description: 'Triggered when a call completes successfully' },
  { id: 'call.failed', name: 'Call Failed', description: 'Triggered when a call fails' },
  { id: 'call.transcription.available', name: 'Transcription Available', description: 'Triggered when a call transcription is ready' },
  { id: 'agent.created', name: 'Agent Created', description: 'Triggered when a new agent is created' },
  { id: 'agent.updated', name: 'Agent Updated', description: 'Triggered when an agent is updated' },
  { id: 'agent.deleted', name: 'Agent Deleted', description: 'Triggered when an agent is deleted' },
];
