
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { setupAutoRecharge } from '../utils/BillingUtils';

interface AutoRechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const autoRechargeFormSchema = z.object({
  enabled: z.boolean(),
  threshold: z.string().min(1, "Valor requerido"),
  amount: z.string().min(1, "Valor requerido"),
});

const AutoRechargeDialog = ({ open, onOpenChange }: AutoRechargeDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const autoRechargeForm = useForm<z.infer<typeof autoRechargeFormSchema>>({
    resolver: zodResolver(autoRechargeFormSchema),
    defaultValues: {
      enabled: false,
      threshold: '10.00',
      amount: '50.00',
    },
  });

  const saveAutoRechargeSettings = async (data: z.infer<typeof autoRechargeFormSchema>) => {
    setIsSubmitting(true);
    try {
      if (data.enabled) {
        // Convertir a números para el procesamiento
        const threshold = parseFloat(data.threshold);
        const amount = parseFloat(data.amount);
        
        // Validaciones adicionales
        if (isNaN(threshold) || threshold <= 0) {
          throw new Error('El umbral debe ser un número positivo');
        }
        
        if (isNaN(amount) || amount <= 0) {
          throw new Error('El monto debe ser un número positivo');
        }
        
        // Configurar recarga automática
        await setupAutoRecharge(threshold, amount);
      }
      
      // En una implementación real, también habría un endpoint para desactivar
      // la recarga automática si data.enabled es false
      
      toast.success('Configuración de recarga automática guardada');
      onOpenChange(false);
    } catch (error) {
      console.error('Error al guardar la configuración de recarga automática:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar la configuración');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Configurar recarga automática
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuración de recarga automática</DialogTitle>
          <DialogDescription>
            Establece cuando y cuánto recargar automáticamente.
          </DialogDescription>
        </DialogHeader>
        <Form {...autoRechargeForm}>
          <form onSubmit={autoRechargeForm.handleSubmit(saveAutoRechargeSettings)} className="space-y-4">
            <FormField
              control={autoRechargeForm.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Activar recarga automática
                    </FormLabel>
                    <FormDescription>
                      Recargar automáticamente cuando el saldo llegue al umbral mínimo
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={autoRechargeForm.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Umbral mínimo ($MXN)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="10.00" 
                      {...field} 
                      disabled={!autoRechargeForm.watch('enabled')}
                    />
                  </FormControl>
                  <FormDescription>
                    Se realizará una recarga cuando el saldo sea menor a este valor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={autoRechargeForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto de recarga ($MXN)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="50.00" 
                      {...field} 
                      disabled={!autoRechargeForm.watch('enabled')}
                    />
                  </FormControl>
                  <FormDescription>
                    Monto que se recargará automáticamente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar configuración
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AutoRechargeDialog;
