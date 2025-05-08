
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { AddCardDialog } from '../dialogs/AddCardDialog';
import { PaymentMethod } from '../types';
import { toast } from 'sonner';

interface BillingHeaderProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  refreshBillingData?: () => Promise<void>;
}

const BillingHeader = ({ 
  paymentMethods, 
  setPaymentMethods, 
  refreshBillingData 
}: BillingHeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!refreshBillingData) return;
    
    setIsRefreshing(true);
    try {
      await refreshBillingData();
      toast.success("Billing data refreshed");
    } catch (error) {
      console.error("Error refreshing billing data:", error);
      toast.error("Failed to refresh billing data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-2xl font-semibold">Billing & Usage</h1>
        <p className="text-muted-foreground">Manage your plan, payment methods and billing history</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        <AddCardDialog 
          paymentMethods={paymentMethods}
          setPaymentMethods={setPaymentMethods}
        />
      </div>
    </div>
  );
};

export default BillingHeader;
