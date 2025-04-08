
export interface PhoneNumber {
  id: string;
  number: string;
  friendly_name?: string;
  nickname?: string;
  status: 'active' | 'inactive';
  agent_id?: string;
  created_at?: string;
  inbound_agent_id?: string | null;
  outbound_agent_id?: string | null;
  inbound_webhook_url?: string | null;
  phone_number?: string;
  phone_number_type?: string;
  phone_number_pretty?: string;
  area_code?: number;
  last_modification_timestamp?: number;
  provider?: string;
}
