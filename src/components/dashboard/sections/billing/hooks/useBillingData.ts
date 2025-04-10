
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { Invoice, UsageData, PaymentMethod, UsageHistoryItem } from '../types';
import { 
  mockInvoices, 
  mockUsage, 
  mockUsageHistory, 
  mockPaymentMethods, 
  mockApiKeys 
} from '../data/mockData';

interface UseBillingDataReturn {
  loading: boolean;
  invoices: Invoice[];
  usage: UsageData | null;
  usageHistory: UsageHistoryItem[];
  paymentMethods: PaymentMethod[];
  apiKeys: any[];
  refreshBillingData: () => Promise<void>;
}

export const useBillingData = (): UseBillingDataReturn => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [usageHistory, setUsageHistory] = useState<UsageHistoryItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      // Using mock data instead of API calls
      console.log('Setting mock API keys');
      setApiKeys(mockApiKeys);
      
      // For now, use mock data for other billing information
      setInvoices(mockInvoices);
      setUsage(mockUsage);
      setUsageHistory(mockUsageHistory);
      setPaymentMethods(mockPaymentMethods);
      
      // Simulate a delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
      toast.error('Failed to load billing information');
      
      // Still use mock data as fallback
      setApiKeys(mockApiKeys);
      setInvoices(mockInvoices);
      setUsage(mockUsage);
      setUsageHistory(mockUsageHistory);
      setPaymentMethods(mockPaymentMethods);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  return {
    loading,
    invoices,
    usage,
    usageHistory,
    paymentMethods,
    apiKeys,
    refreshBillingData: fetchBillingData,
  };
};
