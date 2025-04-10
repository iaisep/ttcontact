
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { PaymentMethod } from '../types';
import { createPaymentMethod, mapStripePaymentMethod } from '../utils/BillingUtils';

interface CardFormProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  closeDialog: () => void;
}

const cardFormSchema = z.object({
  cardholderName: z.string().min(2, "Nombre requerido"),
});

const CardForm = ({ paymentMethods, setPaymentMethods, closeDialog }: CardFormProps) => {
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
      // Create payment method in Stripe
      const paymentMethod = await createPaymentMethod(stripe, elements);
      
      // In a real implementation, we'd send paymentMethod.id to the server
      // to associate it with the current user
      
      // Simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the new card to the local list
      const newCard = mapStripePaymentMethod({
        ...paymentMethod,
        isDefault: paymentMethods.length === 0
      });
      
      setPaymentMethods([...paymentMethods, newCard]);
      toast.success('Tarjeta agregada exitosamente');
      cardForm.reset();
      closeDialog();
    } catch (error) {
      console.error('Error adding card:', error);
      toast.error(error instanceof Error ? error.message : 'Error adding card');
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

export default CardForm;
