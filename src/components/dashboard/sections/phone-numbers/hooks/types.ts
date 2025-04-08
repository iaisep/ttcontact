
export interface PhoneNumber {
  id: string;
  number: string;
  friendly_name?: string;
  nickname?: string;
  status: 'active' | 'inactive';
  agent_id?: string;
  created_at: string;
  inbound_agent_id?: string;
  outbound_agent_id?: string;
  inbound_webhook_url?: string | null;
}
