
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
      // Use the new endpoint
      const response = await fetch('https://wf2iallamadas.universidadisep.com/webhook/billing/');
      
      if (!response.ok) {
        throw new Error(`Error fetching billing data: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Parse the received data
      if (data.invoices) setInvoices(data.invoices);
      if (data.usage) setUsage(data.usage);
      if (data.usageHistory) setUsageHistory(data.usageHistory);
      if (data.paymentMethods) setPaymentMethods(data.paymentMethods);
      if (data.apiKeys) setApiKeys(data.apiKeys);
      
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
      toast.error('Failed to load billing information');
      
      // Fallback to mock data in case of error
      setInvoices(mockInvoices);
      setUsage(mockUsage);
      setUsageHistory(mockUsageHistory);
      setPaymentMethods(mockPaymentMethods);
      setApiKeys(mockApiKeys);
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
