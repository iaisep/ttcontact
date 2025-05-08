
export interface CallHistoryItem {
  id: string;
  callId: string;
  batchCallId?: string;
  agentName?: string;
  agentId?: string;
  phoneNumber: string;
  from: string;
  to: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  cost: string;
  status: 'ended' | 'error';
  disconnectionReason: string;
  userSentiment: 'Positive' | 'Neutral' | 'Unknown' | 'Negative';
  callSuccessful: boolean;
  callSuccessfulStatus?: string;
  endToEndLatency?: string;
  oportunidad?: boolean;
  opportunidad?: string;
  resumen_2da_llamada?: string;
}

export interface FilterOption {
  field: keyof CallHistoryItem;
  value: string | boolean | null;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith';
}

export interface CallDetailInfo extends CallHistoryItem {
  transcript?: string;
  agentDetails?: any;
}

export interface ColumnVisibility {
  [key: string]: boolean;
}
