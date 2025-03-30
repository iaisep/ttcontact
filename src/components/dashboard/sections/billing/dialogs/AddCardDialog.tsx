import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { PaymentMethod } from '../types';

interface AddCardDialogProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;
}

const cardFormSchema = z.object({
  cardNumber: z.string().min(16, "Número de tarjeta inválido").max(19),
  cardholderName: z.string().min(2, "Nombre requerido"),
  expiryMonth: z.string().min(1, "Requerido"),
  expiryYear: z.string().min(1, "Requerido"),
  cvc: z.string().min(3, "CVC inválido").max(4),
});

const AddCardDialog = ({ paymentMethods, setPaymentMethods }: AddCardDialogProps) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
    },
  });

  const handleAddCard = async (data: z.infer<typeof cardFormSchema>) => {
    setIsAddingCard(true);
    try {
      // In a real app, this would be an actual Stripe integration
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add mock card to list
      const newCard: PaymentMethod = {
        id: `pm_${Date.now()}`,
        brand: data.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
        last4: data.cardNumber.slice(-4),
        expMonth: parseInt(data.expiryMonth),
        expYear: parseInt(data.expiryYear),
        isDefault: paymentMethods.length === 0,
      };
      
      setPaymentMethods([...paymentMethods, newCard]);
      toast.success('Tarjeta agregada exitosamente');
      cardForm.reset();
      setIsAddingCard(false);
    } catch (error) {
      console.error('Failed to add payment method:', error);
      toast.error('Error al agregar la tarjeta');
    } finally {
      setIsAddingCard(false);
    }
  };

  return (
    <Dialog>
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
            <FormField
              control={cardForm.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de tarjeta</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="1234 5678 9012 3456" 
                      {...field} 
                      onChange={(e) => {
                        // Keep only digits
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                      maxLength={19}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label>Fecha de expiración</Label>
                <div className="flex gap-2">
                  <FormField
                    control={cardForm.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = i + 1;
                              return (
                                <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                                  {month.toString().padStart(2, '0')}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={cardForm.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              const shortYear = year.toString().substr(-2);
                              return (
                                <SelectItem key={year} value={shortYear}>
                                  {shortYear}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={cardForm.control}
                name="cvc"
                render={({ field }) => (
                  <FormItem className="flex-none w-20">
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123" 
                        {...field} 
                        onChange={(e) => {
                          // Keep only digits
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                        maxLength={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isAddingCard}>
                {isAddingCard && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Agregar tarjeta
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
