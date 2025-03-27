
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
import { Loader2, Download, CreditCard, Calendar, DollarSign, TrendingUp, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

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

const BillingSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [usageHistory, setUsageHistory] = useState<any[]>([]);

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

  // Use mock data for UI demonstration
  useEffect(() => {
    setInvoices(mockInvoices);
    setUsage(mockUsage);
    setUsageHistory(mockUsageHistory);
    setLoading(false);
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      // In a real app, these would be API calls
      // const invoicesData = await fetchWithAuth('/billing/invoices');
      // const usageData = await fetchWithAuth('/billing/usage');
      // const historyData = await fetchWithAuth('/billing/history');
      
      // Simulate API calls with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvoices(mockInvoices);
      setUsage(mockUsage);
      setUsageHistory(mockUsageHistory);
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
        <h1 className="text-2xl font-bold">Billing</h1>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Update Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Bill</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(usage?.total_cost ?? 0)}</div>
            <p className="text-xs text-muted-foreground">{usage?.current_period}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Minutes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage?.voice_minutes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(usage?.voice_minutes ? usage.voice_minutes * 0.075 : 0)} at $0.075 per minute
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Invoice</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">May 1, 2025</div>
            <p className="text-xs text-muted-foreground">Estimated: {formatCurrency(usage?.total_cost ? usage.total_cost + 40 : 0)}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Current Usage</TabsTrigger>
          <TabsTrigger value="history">Usage History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Period Usage</CardTitle>
              <CardDescription>
                {usage?.current_period}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Voice Minutes</span>
                    <span className="font-medium">{usage?.voice_minutes.toLocaleString()} minutes</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min((usage?.voice_minutes || 0) / 5000 * 100, 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>5,000 minutes</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">API Calls</span>
                    <span className="font-medium">{usage?.api_calls.toLocaleString()} calls</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min((usage?.api_calls || 0) / 20000 * 100, 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>20,000 calls</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone Numbers</span>
                    <span className="font-medium">{usage?.phone_numbers} numbers</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min((usage?.phone_numbers || 0) / 10 * 100, 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>10 numbers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>
                  Estimated costs for current billing period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y">
                  <div className="flex justify-between py-3 px-4">
                    <div>
                      <p className="font-medium">Voice Minutes</p>
                      <p className="text-sm text-muted-foreground">{usage?.voice_minutes.toLocaleString()} minutes at $0.075 per minute</p>
                    </div>
                    <p className="font-medium text-right">{formatCurrency(usage?.voice_minutes ? usage.voice_minutes * 0.075 : 0)}</p>
                  </div>
                  
                  <div className="flex justify-between py-3 px-4">
                    <div>
                      <p className="font-medium">Phone Numbers</p>
                      <p className="text-sm text-muted-foreground">{usage?.phone_numbers} numbers at $1.00 per number</p>
                    </div>
                    <p className="font-medium text-right">{formatCurrency(usage?.phone_numbers ? usage.phone_numbers * 1.0 : 0)}</p>
                  </div>
                  
                  <div className="flex justify-between py-3 px-4">
                    <div>
                      <p className="font-medium">API Calls</p>
                      <p className="text-sm text-muted-foreground">{usage?.api_calls.toLocaleString()} calls ($0.01 per 1000 calls)</p>
                    </div>
                    <p className="font-medium text-right">{formatCurrency(usage?.api_calls ? usage.api_calls * 0.00001 : 0)}</p>
                  </div>
                  
                  <div className="flex justify-between py-3 px-4">
                    <div>
                      <p className="font-medium">Pro Plan Subscription</p>
                      <p className="text-sm text-muted-foreground">Monthly subscription fee</p>
                    </div>
                    <p className="font-medium text-right">{formatCurrency(49.99)}</p>
                  </div>
                  
                  <div className="flex justify-between py-3 px-4 bg-muted/50">
                    <p className="font-medium">Estimated Total</p>
                    <p className="font-bold text-right">{formatCurrency(usage?.total_cost ?? 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Plan</CardTitle>
                <CardDescription>Pro Plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited voice minutes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Up to 20 parallel calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Upgrade Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Over Time</CardTitle>
              <CardDescription>
                Voice minutes and cost for the past 30 days
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
                    name="Voice Minutes" 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                    name="Cost ($)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Usage Summary</CardTitle>
              <CardDescription>
                Compare usage across months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Voice Minutes</TableHead>
                    <TableHead>API Calls</TableHead>
                    <TableHead>Phone Numbers</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">April 2025</TableCell>
                    <TableCell>{mockUsage.voice_minutes.toLocaleString()}</TableCell>
                    <TableCell>{mockUsage.api_calls.toLocaleString()}</TableCell>
                    <TableCell>{mockUsage.phone_numbers}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockUsage.total_cost)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">March 2025</TableCell>
                    <TableCell>3,840</TableCell>
                    <TableCell>15,420</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell className="text-right">{formatCurrency(289.50)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">February 2025</TableCell>
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
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Your billing history and payment records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <p>No invoices found</p>
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
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
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
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">VISA ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 09/27</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingSection;
