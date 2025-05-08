
export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  download_url: string;
}

export interface UsageData {
  voice_minutes: number;
  api_calls: number;
  phone_numbers: number;
  total_cost: number;
  current_period: string;
  // Add the new API response fields
  voice_total: number;
  telephony_total: number;
  llm_total: number;
  kb_extra_total: number;
}

export interface UsageHistoryItem {
  date: string;
  minutes: number;
  cost: number;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}
