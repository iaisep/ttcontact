import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, CreditCard, Calendar, DollarSign, TrendingUp, FileText, Plus, CreditCardIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  download_url: string;
}

interface UsageData {
  voice_minutes: number;
  api_calls: number;
  phone_numbers: number;
  total_cost: number;
  current_period: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

const cardFormSchema = z.object({
  cardNumber: z.string().min(16, "Número de tarjeta inválido").max(19),
  cardholderName: z.string().min(2, "Nombre requerido"),
  expiryMonth: z.string().min(1, "Requerido"),
  expiryYear: z.string().min(1, "Requerido"),
  cvc: z.string().min(3, "CVC inválido").max(4),
});

const autoRechargeFormSchema = z.object({
  enabled: z.boolean(),
  threshold: z.string().min(1, "Valor requerido"),
  amount: z.string().min(1, "Valor requerido"),
});

const BillingSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [usageHistory, setUsageHistory] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [autoRechargeOpen, setAutoRechargeOpen] = useState(false);

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

  const autoRechargeForm = useForm<z.infer<typeof autoRechargeFormSchema>>({
    resolver: zodResolver(autoRechargeFormSchema),
    defaultValues: {
      enabled: false,
      threshold: '10.00',
      amount: '50.00',
    },
  });

  // Mock data for UI demonstration
  const mockInvoices: Invoice[] = [
    {
      id: 'INV-001',
      date: '2025-03-01',
      amount: 289.50,
      status: 'paid',
      download_url: '#',
    },
    {
      id: 'INV-002',
      date: '2025-02-01',
      amount: 245.75,
      status: 'paid',
      download_url: '#',
    },
    {
      id: 'INV-003',
      date: '2025-01-01',
      amount: 198.25,
      status: 'paid',
      download_url: '#',
    },
  ];

  const mockUsage: UsageData = {
    voice_minutes: 4328,
    api_calls: 18750,
    phone_numbers: 5,
    total_cost: 342.75,
    current_period: 'Apr 1 - Apr 27, 2025',
  };

  const mockUsageHistory = [
    { date: 'Mar 1', minutes: 3840, cost: 289.50 },
    { date: 'Mar 5', minutes: 4012, cost: 301.25 },
    { date: 'Mar 10', minutes: 4125, cost: 309.50 },
    { date: 'Mar 15', minutes: 4250, cost: 319.75 },
    { date: 'Mar 20', minutes: 4302, cost: 324.50 },
    { date: 'Mar 25', minutes: 4328, cost: 342.75 },
  ];

  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      brand: 'visa',
      last4: '4242',
      expMonth: 9,
      expYear: 27,
      isDefault: true,
    }
  ];

  // Use mock data for UI demonstration
  useEffect(() => {
    setInvoices(mockInvoices);
    setUsage(mockUsage);
    setUsageHistory(mockUsageHistory);
    setPaymentMethods(mockPaymentMethods);
    setLoading(false);
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      // In a real app, these would be API calls
      // const invoicesData = await fetchWithAuth('/billing/invoices');
      // const usageData = await fetchWithAuth('/billing/usage');
      // const historyData = await fetchWithAuth('/billing/history');
      // const paymentMethodsData = await fetchWithAuth('/billing/payment-methods');
      
      // Simulate API calls with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvoices(mockInvoices);
      setUsage(mockUsage);
      setUsageHistory(mockUsageHistory);
      setPaymentMethods(mockPaymentMethods);
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (data: z.infer<typeof cardFormSchema>) => {
    setIsAddingCard(true);
    try {
      // In a real app, this would be an actual Stripe integration
      // const response = await fetchWithAuth('/billing/add-payment-method', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      
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
      setIsAddingCard(false);
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      // In a real app, this would be an API call
      // await fetchWithAuth(`/billing/set-default-payment-method/${paymentMethodId}`, {
      //   method: 'POST',
      // });
      
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
      // In a real app, this would be an API call
      // await fetchWithAuth(`/billing/delete-payment-method/${paymentMethodId}`, {
      //   method: 'DELETE',
      // });
      
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

  const saveAutoRechargeSettings = async (data: z.infer<typeof autoRechargeFormSchema>) => {
    try {
      // In a real app, this would be an API call
      // await fetchWithAuth('/billing/auto-recharge-settings', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update UI (not necessary in this mock since we don't display the settings elsewhere)
      
      toast.success('Configuración de recarga automática guardada');
      setAutoRechargeOpen(false);
    } catch (error) {
      console.error('Failed to save auto-recharge settings:', error);
      toast.error('Error al guardar la configuración de recarga automática');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factura actual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(usage?.total_cost ?? 0)}</div>
            <p className="text-xs text-muted-foreground">{usage?.current_period}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minutos de voz</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage?.voice_minutes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(usage?.voice_minutes ? usage.voice_minutes * 0.075 : 0)} a $0.075 por minuto
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima factura</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 de mayo, 2025</div>
            <p className="text-xs text-muted-foreground">Estimado: {formatCurrency(usage?.total_cost ? usage.total_cost + 40 : 0)}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Uso actual</TabsTrigger>
          <TabsTrigger value="history">Historial de uso</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="payment">Métodos de pago</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uso del período actual</CardTitle>
              <CardDescription>
                {usage?.current_period}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Minutos de voz</span>
                    <span className="font-medium">{usage?.voice_minutes.toLocaleString()} minutos</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min((usage?.voice_minutes || 0) / 5000 * 100, 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>5,000 minutos</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Llamadas a API</span>
                    <span className="font-medium">{usage?.api_calls.toLocaleString()} llamadas</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min((usage?.api_calls || 0) / 20000 * 100, 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>20,000 llamadas</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Números telefónicos</span>
                    <span className="font-medium">{usage?.phone_numbers} números</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min((usage?.phone_numbers || 0) / 10 * 100, 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>10 números</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Desglose de costos</CardTitle>
                <CardDescription>
                  Costos estimados para el período de facturación actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y">
                  <div className="flex justify-between py-3 px-4">
                    <div>
                      <p className="font-medium">Minutos de voz</p>
                      <p className="text-sm text-muted-foreground">{usage?.voice_minutes.toLocaleString()} minutos a $0.075 por minuto</p>
                    </div>
                    <p className="font-medium text-right">{formatCurrency(usage?.voice_minutes ? usage.voice_minutes * 0.075 : 0)}</p>
                  </div>
                  
                  <div className="flex justify-between py-3 px-4">
                    <div>
                      <p className="font-medium">Números telefónicos</p>
                      <p className="text-sm text-muted-foreground">{usage?.phone_numbers} números a $1.00 por número</p>
                    </div>
                    <p className="font-medium text-right">{formatCurrency(usage?.phone_numbers ? usage.phone_numbers * 1.0 : 0)}</p>
                  </div>
                  
                  <div className="flex justify-between py-3 px-4">
                    <div>
                      <p className="font-medium">Llamadas a API</p>
                      <p className="text-sm text-muted-foreground">{usage?.api_calls.toLocaleString()} llamadas ($0.01 por 1000 llamadas)</p>
                    </div>
                    <p className="font-medium text-right">{formatCurrency(usage?.api_calls ? usage.api_calls * 0.00001 : 0)}</p>
                  </div>
                  
                  <div className="flex justify-between py-3 px-4">
                    <div>
                      <p className="font-medium">Suscripción Plan Pro</p>
                      <p className="text-sm text-muted-foreground">Cuota de suscripción mensual</p>
                    </div>
                    <p className="font-medium text-right">{formatCurrency(49.99)}</p>
                  </div>
                  
                  <div className="flex justify-between py-3 px-4 bg-muted/50">
                    <p className="font-medium">Total estimado</p>
                    <p className="font-bold text-right">{formatCurrency(usage?.total_cost ?? 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tu Plan</CardTitle>
                <CardDescription>Plan Pro</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Minutos de voz ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Hasta 20 llamadas paralelas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Soporte prioritario</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Analíticas avanzadas</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Actualizar Plan</Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recarga automática</CardTitle>
              <CardDescription>
                Configura recargas automáticas de saldo cuando llegues a un umbral mínimo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={autoRechargeOpen} onOpenChange={setAutoRechargeOpen}>
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
                        <Button type="submit">
                          Guardar configuración
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                <div className="flex items-start">
                  <div className="mr-3 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4"></path>
                      <path d="M12 8h.01"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700">Acerca de la recarga automática</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      La recarga automática te permite mantener tu servicio sin interrupciones. 
                      Cuando tu saldo alcance el umbral mínimo establecido, se realizará un cargo automático 
                      a tu método de pago por el monto que hayas configurado.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uso a lo largo del tiempo</CardTitle>
              <CardDescription>
                Minutos de voz y costo en los últimos 30 días
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="Minutos de voz" 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                    name="Costo ($)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumen de uso mensual</CardTitle>
              <CardDescription>
                Comparar uso entre meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mes</TableHead>
                    <TableHead>Minutos de voz</TableHead>
                    <TableHead>Llamadas a API</TableHead>
                    <TableHead>Números telefónicos</TableHead>
                    <TableHead className="text-right">Costo total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Abril 2025</TableCell>
                    <TableCell>{mockUsage.voice_minutes.toLocaleString()}</TableCell>
                    <TableCell>{mockUsage.api_calls.toLocaleString()}</TableCell>
                    <TableCell>{mockUsage.phone_numbers}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockUsage.total_cost)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marzo 2025</TableCell>
                    <TableCell>3,840</TableCell>
                    <TableCell>15,420</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell className="text-right">{formatCurrency(289.50)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Febrero 2025</TableCell>
                    <TableCell>3,275</TableCell>
                    <TableCell>12,840</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell className="text-right">{formatCurrency(245.75)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facturas</CardTitle>
              <CardDescription>
                Tu historial de facturación y registros de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factura #</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <p>No se encontraron facturas</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>
                            {new Date(invoice.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(invoice.amount)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                              {invoice.status === 'paid' ? 'Pagada' : 
                               invoice.status === 'pending' ? 'Pendiente' : 'Vencida'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <a href={invoice.download_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                PDF
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4">
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
                        <CreditCard className="h-6 w-6 text-primary" />
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
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Configuración de recarga automática</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
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
                          <Button type="submit">
                            Guardar configuración
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingSection;
