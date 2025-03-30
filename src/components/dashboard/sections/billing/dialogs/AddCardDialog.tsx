
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { PaymentMethod } from '../types';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { stripePromise, createPaymentMethod, mapStripePaymentMethod } from '../utils/BillingUtils';

interface AddCardDialogProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;
}

const cardFormSchema = z.object({
  cardholderName: z.string().min(2, "Nombre requerido"),
});

// Componente del formulario de tarjeta
const CardForm = ({ paymentMethods, setPaymentMethods, closeDialog }: AddCardDialogProps & { closeDialog: () => void }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  
  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardholderName: '',
    },
  });

  const handleAddCard = async (data: z.infer<typeof cardFormSchema>) => {
    if (!stripe || !elements) {
      toast.error('No se ha podido inicializar Stripe');
      return;
    }

    setIsAddingCard(true);
    try {
      // Crear el método de pago en Stripe
      const paymentMethod = await createPaymentMethod(stripe, elements);
      
      // En una implementación real, aquí enviaríamos el paymentMethod.id al servidor
      // para asociarlo con el usuario actual
      
      // Simular una respuesta exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Añadir la nueva tarjeta a la lista local
      const newCard = mapStripePaymentMethod({
        ...paymentMethod,
        isDefault: paymentMethods.length === 0
      });
      
      setPaymentMethods([...paymentMethods, newCard]);
      toast.success('Tarjeta agregada exitosamente');
      cardForm.reset();
      closeDialog();
    } catch (error) {
      console.error('Error al agregar la tarjeta:', error);
      toast.error(error instanceof Error ? error.message : 'Error al agregar la tarjeta');
    } finally {
      setIsAddingCard(false);
    }
  };

  return (
    <Form {...cardForm}>
      <form onSubmit={cardForm.handleSubmit(handleAddCard)} className="space-y-4">
        <FormField
          control={cardForm.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del titular</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <Label>Detalles de la tarjeta</Label>
          <div className="border rounded-md p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          <FormDescription>
            Información segura procesada por Stripe
          </FormDescription>
        </div>
        
        <DialogFooter>
          <Button type="submit" disabled={isAddingCard || !stripe}>
            {isAddingCard && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Agregar tarjeta
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

// Componente principal de diálogo
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
        <Elements stripe={stripePromise}>
          <CardForm {...props} closeDialog={() => setOpen(false)} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
