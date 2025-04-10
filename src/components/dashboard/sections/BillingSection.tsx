
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Importaciones de tipos
import { Invoice, UsageData, PaymentMethod, UsageHistoryItem } from './billing/types';

// Importaciones de componentes
import BillingSummaryCards from './billing/BillingSummaryCards';
import CurrentUsageTab from './billing/tabs/CurrentUsageTab';
import UsageHistoryTab from './billing/tabs/UsageHistoryTab';
import InvoicesTab from './billing/tabs/InvoicesTab';
import PaymentMethodsTab from './billing/tabs/PaymentMethodsTab';
import AddCardDialog from './billing/dialogs/AddCardDialog';
import StripeWrapper from './billing/components/StripeWrapper';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './billing/utils/BillingUtils';

const BillingSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [usageHistory, setUsageHistory] = useState<UsageHistoryItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);

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
  
  // Mock API Keys data
  const mockApiKeys = [
    { id: 'key_1', name: 'Production API Key', key: 'pk_prod_123456789', created: '2025-03-01' },
    { id: 'key_2', name: 'Development API Key', key: 'pk_dev_987654321', created: '2025-03-15' }
  ];

  useEffect(() => {
    fetchBillingData();
  }, []);

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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Actualizar método de pago
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar nueva tarjeta</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de tu tarjeta para agregarla como método de pago.
              </DialogDescription>
            </DialogHeader>
            <StripeWrapper>
              <AddCardDialog 
                paymentMethods={paymentMethods}
                setPaymentMethods={setPaymentMethods}
              />
            </StripeWrapper>
          </DialogContent>
        </Dialog>
      </div>

      <BillingSummaryCards usage={usage} />
      
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Uso actual</TabsTrigger>
          <TabsTrigger value="history">Historial de uso</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="payment">Métodos de pago</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage">
          <CurrentUsageTab usage={usage} />
        </TabsContent>
        
        <TabsContent value="history">
          <UsageHistoryTab usageHistory={usageHistory} usage={usage} />
        </TabsContent>
        
        <TabsContent value="invoices">
          <InvoicesTab invoices={invoices} />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentMethodsTab 
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingSection;
