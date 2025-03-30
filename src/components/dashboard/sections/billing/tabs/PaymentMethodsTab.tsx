
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard as CreditCardIcon, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PaymentMethod } from '../types';
import { toast } from 'sonner';
import AddCardDialog from '../dialogs/AddCardDialog';
import AutoRechargeDialog from '../dialogs/AutoRechargeDialog';
import { setDefaultPaymentMethod, deletePaymentMethod } from '../utils/BillingUtils';
import StripeWrapper from '../components/StripeWrapper';

interface PaymentMethodsTabProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;
}

const PaymentMethodsTab = ({ paymentMethods, setPaymentMethods }: PaymentMethodsTabProps) => {
  const [autoRechargeOpen, setAutoRechargeOpen] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    setProcessing(paymentMethodId);
    try {
      // Llamar a la API para establecer el método de pago predeterminado
      await setDefaultPaymentMethod(paymentMethodId);
      
      // Actualizar el estado local
      setPaymentMethods(
        paymentMethods.map(method => ({
          ...method,
          isDefault: method.id === paymentMethodId,
        }))
      );
      
      toast.success('Método de pago predeterminado actualizado');
    } catch (error) {
      console.error('Error al establecer el método de pago predeterminado:', error);
      toast.error('Error al actualizar el método de pago predeterminado');
    } finally {
      setProcessing(null);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (paymentMethods.find(m => m.id === paymentMethodId)?.isDefault) {
      toast.error('No se puede eliminar el método de pago predeterminado');
      return;
    }

    setProcessing(paymentMethodId);
    try {
      // Llamar a la API para eliminar el método de pago
      await deletePaymentMethod(paymentMethodId);
      
      // Eliminar del estado local
      setPaymentMethods(
        paymentMethods.filter(method => method.id !== paymentMethodId)
      );
      
      toast.success('Método de pago eliminado');
    } catch (error) {
      console.error('Error al eliminar el método de pago:', error);
      toast.error('Error al eliminar el método de pago');
    } finally {
      setProcessing(null);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    // En una implementación más completa, podríamos tener iconos específicos para cada marca
    return <CreditCardIcon className="h-6 w-6 text-primary" />;
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
                    {getCardBrandIcon(method.brand)}
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSetDefaultPaymentMethod(method.id)}
                          disabled={processing === method.id}
                        >
                          {processing === method.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : null}
                          Establecer como predeterminada
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        disabled={processing === method.id || method.isDefault}
                      >
                        {processing === method.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            <StripeWrapper>
              <AddCardDialog 
                setPaymentMethods={setPaymentMethods} 
                paymentMethods={paymentMethods} 
              />
            </StripeWrapper>
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
