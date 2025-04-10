
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BillingSummaryCards from '../BillingSummaryCards';
import CurrentUsageTab from '../tabs/CurrentUsageTab';
import UsageHistoryTab from '../tabs/UsageHistoryTab';
import InvoicesTab from '../tabs/InvoicesTab';
import PaymentMethodsTab from '../tabs/PaymentMethodsTab';
import { Invoice, UsageData, PaymentMethod, UsageHistoryItem } from '../types';

interface BillingContentProps {
  invoices: Invoice[];
  usage: UsageData | null;
  usageHistory: UsageHistoryItem[];
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;
}

const BillingContent = ({ 
  invoices, 
  usage, 
  usageHistory, 
  paymentMethods, 
  setPaymentMethods 
}: BillingContentProps) => {
  return (
    <div className="space-y-6">
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

export default BillingContent;
