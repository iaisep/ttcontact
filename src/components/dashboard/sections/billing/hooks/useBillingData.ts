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

// Type for the API response structure
interface BillingApiResponse {
  user_id: string;
  telephony_total: number;
  voice_total: number;
  llm_total: number;
  kb_extra_total: number;
  grand_total: number;
  call_count: number;
  kb_count: number;
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
      // Make POST request with correct authorization header
      const response = await fetch('https://wf2iallamadas.universidadisep.com/webhook/billing/', {
        method: 'POST',
        headers: {
          'Authorization': 'ak_1eae55876de478c7ef725fafbb202eb026cbe9eb1cddad495f67e687eadc03a7',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching billing data: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if we have the expected array structure and process the first item
      if (Array.isArray(data) && data.length > 0) {
        const billingData = data[0] as BillingApiResponse;
        
        // Convert the API response to our usage data structure
        const usageData: UsageData = {
          voice_minutes: Math.round(billingData.voice_total / 0.075), // Estimating minutes based on rate
          api_calls: billingData.call_count * 1000, // Approximation of API calls
          phone_numbers: Math.ceil(billingData.telephony_total / 1.0), // Estimating phone number count
          total_cost: billingData.grand_total,
          current_period: `Mayo 1 - Mayo 31, 2025`
        };
        
        setUsage(usageData);
        
        // Keep using mock data for other fields for now
        setInvoices(mockInvoices);
        setUsageHistory(mockUsageHistory);
        setPaymentMethods(mockPaymentMethods);
        setApiKeys(mockApiKeys);
      } else {
        console.warn('Unexpected API response format:', data);
        throw new Error('Invalid response format from billing API');
      }
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
