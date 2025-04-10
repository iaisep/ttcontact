
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard } from 'lucide-react';
import AddCardDialog from '../dialogs/AddCardDialog';
import StripeWrapper from './StripeWrapper';
import { PaymentMethod } from '../types';

interface BillingHeaderProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;
}

const BillingHeader = ({ paymentMethods, setPaymentMethods }: BillingHeaderProps) => {
  return (
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
  );
};

export default BillingHeader;
