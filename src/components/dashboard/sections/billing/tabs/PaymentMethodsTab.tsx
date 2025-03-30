
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard as CreditCardIcon, Plus, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PaymentMethod } from '../types';
import { toast } from 'sonner';
import AddCardDialog from '../dialogs/AddCardDialog';
import AutoRechargeDialog from '../dialogs/AutoRechargeDialog';

interface PaymentMethodsTabProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;
}

const PaymentMethodsTab = ({ paymentMethods, setPaymentMethods }: PaymentMethodsTabProps) => {
  const [autoRechargeOpen, setAutoRechargeOpen] = useState(false);

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update UI
      setPaymentMethods(
        paymentMethods.map(method => ({
          ...method,
          isDefault: method.id === paymentMethodId,
        }))
      );
      
      toast.success('Método de pago predeterminado actualizado');
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      toast.error('Error al actualizar el método de pago predeterminado');
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from UI
      setPaymentMethods(
        paymentMethods.filter(method => method.id !== paymentMethodId)
      );
      
      toast.success('Método de pago eliminado');
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      toast.error('Error al eliminar el método de pago');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Métodos de pago</CardTitle>
          <CardDescription>
            Administra tus opciones de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex flex-col items-center gap-2">
                <CreditCardIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No hay métodos de pago registrados</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border rounded-md p-4 flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded">
                    <CreditCardIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {method.brand.toUpperCase()} terminada en {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expira {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                        </p>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-4">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => setDefaultPaymentMethod(method.id)}>
                          Establecer como predeterminada
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deletePaymentMethod(method.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            <AddCardDialog setPaymentMethods={setPaymentMethods} paymentMethods={paymentMethods} />
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Configuración de recarga automática</h3>
            <AutoRechargeDialog open={autoRechargeOpen} onOpenChange={setAutoRechargeOpen} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodsTab;
