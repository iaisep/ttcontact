
import { Invoice, UsageData, PaymentMethod, UsageHistoryItem } from '../types';

// Mock invoices data
export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    date: '2025-03-01',
    amount: 289.50,
    status: 'paid',
    download_url: '#',
  },
  {
    id: 'INV-002',
    date: '2025-02-01',
    amount: 245.75,
    status: 'paid',
    download_url: '#',
  },
  {
    id: 'INV-003',
    date: '2025-01-01',
    amount: 198.25,
    status: 'paid',
    download_url: '#',
  },
];

// Mock usage data
export const mockUsage: UsageData = {
  voice_minutes: 4328,
  api_calls: 18750,
  phone_numbers: 5,
  total_cost: 342.75,
  current_period: 'Apr 1 - Apr 27, 2025',
};

// Mock usage history data
export const mockUsageHistory: UsageHistoryItem[] = [
  { date: 'Mar 1', minutes: 3840, cost: 289.50 },
  { date: 'Mar 5', minutes: 4012, cost: 301.25 },
  { date: 'Mar 10', minutes: 4125, cost: 309.50 },
  { date: 'Mar 15', minutes: 4250, cost: 319.75 },
  { date: 'Mar 20', minutes: 4302, cost: 324.50 },
  { date: 'Mar 25', minutes: 4328, cost: 342.75 },
];

// Mock payment methods data
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    brand: 'visa',
    last4: '4242',
    expMonth: 9,
    expYear: 27,
    isDefault: true,
  }
];

// Mock API keys data
export const mockApiKeys = [
  { id: 'key_1', name: 'Production API Key', key: 'pk_prod_123456789', created: '2025-03-01' },
  { id: 'key_2', name: 'Development API Key', key: 'pk_dev_987654321', created: '2025-03-15' }
];
