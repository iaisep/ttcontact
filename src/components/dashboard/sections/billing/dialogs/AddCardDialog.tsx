
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { PaymentMethod } from '../types';
import CardForm from '../components/CardForm';
import StripeWrapper from '../components/StripeWrapper';

interface AddCardDialogProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;
}

const AddCardDialog = (props: AddCardDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <CreditCard className="h-4 w-4 mr-2" />
          Agregar método de pago
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
          <CardForm 
            {...props} 
            closeDialog={() => setOpen(false)} 
          />
        </StripeWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
