
import { useState } from 'react';
import BillingHeader from './billing/components/BillingHeader';
import BillingContent from './billing/components/BillingContent';
import BillingLoading from './billing/components/BillingLoading';
import { useBillingData } from './billing/hooks/useBillingData';
import { PaymentMethod } from './billing/types';

const BillingSection = () => {
  const { 
    loading, 
    invoices, 
    usage, 
    usageHistory, 
    paymentMethods: initialPaymentMethods, 
    apiKeys,
    refreshBillingData
  } = useBillingData();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);

  if (loading) {
    return <BillingLoading />;
  }

  return (
    <div className="space-y-6">
      <BillingHeader 
        paymentMethods={paymentMethods} 
        setPaymentMethods={setPaymentMethods} 
        refreshBillingData={refreshBillingData}
      />
      
      <BillingContent 
        invoices={invoices}
        usage={usage}
        usageHistory={usageHistory}
        paymentMethods={paymentMethods}
        setPaymentMethods={setPaymentMethods}
      />
    </div>
  );
};

export default BillingSection;
