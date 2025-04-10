
import { Loader2 } from 'lucide-react';

const BillingLoading = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default BillingLoading;
