
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

export interface BillingHistoryMonth {
  id: string;
  month: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'ongoing';
  items?: BillingHistoryItem[];
}

export interface BillingHistoryItem {
  id: string;
  name: string;
  amount: number;
  details?: string;
}
