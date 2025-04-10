
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CreditCard, ArrowUpRight, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Import types
import { Invoice, UsageData, PaymentMethod, UsageHistoryItem } from './billing/types';

// Import components
import BillingSummaryCards from './billing/BillingSummaryCards';
import BillingHistoryTab from './billing/tabs/BillingHistoryTab';
import CurrentUsageTab from './billing/tabs/CurrentUsageTab';
import UsageHistoryTab from './billing/tabs/UsageHistoryTab';
import InvoicesTab from './billing/tabs/InvoicesTab';
import PaymentMethodsTab from './billing/tabs/PaymentMethodsTab';
import AddCardDialog from './billing/dialogs/AddCardDialog';
import StripeWrapper from './billing/components/StripeWrapper';
import LimitsTab from './billing/tabs/LimitsTab';

const BillingSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [usageHistory, setUsageHistory] = useState<UsageHistoryItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Mock data for UI demonstration
  const mockInvoices: Invoice[] = [
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

  const mockUsage: UsageData = {
    voice_minutes: 4328,
    api_calls: 18750,
    phone_numbers: 5,
    total_cost: 342.75,
    current_period: 'Apr 1 - Apr 27, 2025',
  };

  const mockUsageHistory: UsageHistoryItem[] = [
    { date: 'Mar 1', minutes: 3840, cost: 289.50 },
    { date: 'Mar 5', minutes: 4012, cost: 301.25 },
    { date: 'Mar 10', minutes: 4125, cost: 309.50 },
    { date: 'Mar 15', minutes: 4250, cost: 319.75 },
    { date: 'Mar 20', minutes: 4302, cost: 324.50 },
    { date: 'Mar 25', minutes: 4328, cost: 342.75 },
  ];

  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      brand: 'visa',
      last4: '4242',
      expMonth: 9,
      expYear: 27,
      isDefault: true,
    }
  ];

  // Use mock data for UI demonstration
  useState(() => {
    setInvoices(mockInvoices);
    setUsage(mockUsage);
    setUsageHistory(mockUsageHistory);
    setPaymentMethods(mockPaymentMethods);
    setLoading(false);
  });

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      // In a real app, these would be API calls
      // Simulate API calls with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvoices(mockInvoices);
      setUsage(mockUsage);
      setUsageHistory(mockUsageHistory);
      setPaymentMethods(mockPaymentMethods);
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Facturación</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Change payment methods
          </Button>
          <Button className="flex items-center">
            <Info className="mr-2 h-4 w-4" />
            Manage billing info
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="history">Billing History</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <BillingHistoryTab />
        </TabsContent>
        
        <TabsContent value="usage">
          <CurrentUsageTab usage={usage} />
        </TabsContent>
        
        <TabsContent value="limits">
          <LimitsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingSection;
