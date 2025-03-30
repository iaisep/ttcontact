
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Phone, PhoneOff, Search } from 'lucide-react';
import { toast } from 'sonner';
import { PaginationControls } from '@/components/ui/pagination';

interface PhoneNumber {
  id: string;
  number: string;
  friendly_name: string;
  status: 'active' | 'inactive';
  agent_id?: string;
  created_at: string;
}

const PhoneNumbersSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchPhoneNumbers();
    fetchAgents();
  }, []);

  const fetchPhoneNumbers = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth('/phone-numbers');
      setPhoneNumbers(data);
    } catch (error) {
      toast.error('Failed to fetch phone numbers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await fetchWithAuth('/agents');
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const assignAgent = async (phoneId: string, agentId: string) => {
    try {
      const updatedPhone = await fetchWithAuth(`/phone-numbers/${phoneId}`, {
        method: 'PUT',
        body: JSON.stringify({ agent_id: agentId }),
      });
      setPhoneNumbers(phoneNumbers.map(phone => 
        phone.id === phoneId ? updatedPhone : phone
      ));
      toast.success('Agent assigned to phone number');
    } catch (error) {
      toast.error('Failed to assign agent');
      console.error(error);
    }
  };

  const purchasePhoneNumber = async (areaCode: string) => {
    try {
      const newNumber = await fetchWithAuth('/phone-numbers', {
        method: 'POST',
        body: JSON.stringify({ 
          area_code: areaCode,
          country: 'US'
        }),
      });
      setPhoneNumbers([...phoneNumbers, newNumber]);
      toast.success('Phone number purchased successfully');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to purchase phone number');
      console.error(error);
    }
  };

  const releasePhoneNumber = async (phoneId: string) => {
    try {
      await fetchWithAuth(`/phone-numbers/${phoneId}`, {
        method: 'DELETE',
      });
      setPhoneNumbers(phoneNumbers.filter(phone => phone.id !== phoneId));
      toast.success('Phone number released');
    } catch (error) {
      toast.error('Failed to release phone number');
      console.error(error);
    }
  };

  const filteredPhoneNumbers = phoneNumbers.filter(phone =>
    phone.number.includes(searchQuery) || 
    phone.friendly_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get paginated data
  const paginatedPhoneNumbers = filteredPhoneNumbers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page when search query or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Phone Numbers</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Purchase Number
        </Button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search phone numbers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Friendly Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Purchased</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPhoneNumbers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Phone className="h-8 w-8 text-muted-foreground" />
                        <p>No phone numbers found</p>
                        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Purchase Your First Number
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPhoneNumbers.map((phone) => (
                    <TableRow key={phone.id}>
                      <TableCell className="font-medium">{phone.number}</TableCell>
                      <TableCell>{phone.friendly_name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          phone.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {phone.status.charAt(0).toUpperCase() + phone.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {phone.agent_id
                          ? agents.find(a => a.id === phone.agent_id)?.name || 'Agent not found'
                          : 'Not assigned'}
                      </TableCell>
                      <TableCell>{new Date(phone.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Assign Agent
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Agent to {phone.number}</DialogTitle>
                                <DialogDescription>
                                  Select an agent to handle calls to this phone number.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="agent-select">Select Agent</Label>
                                  <select
                                    id="agent-select"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                    defaultValue={phone.agent_id || ''}
                                    onChange={(e) => assignAgent(phone.id, e.target.value)}
                                  >
                                    <option value="">None (Unassign)</option>
                                    {agents.map((agent) => (
                                      <option key={agent.id} value={agent.id}>
                                        {agent.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (confirm('Are you sure you want to release this phone number? This action cannot be undone.')) {
                                releasePhoneNumber(phone.id);
                              }
                            }}
                          >
                            <PhoneOff className="mr-2 h-4 w-4" />
                            Release
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredPhoneNumbers.length > 0 && (
            <PaginationControls
              totalItems={filteredPhoneNumbers.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50]}
            />
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Purchase Phone Number</DialogTitle>
            <DialogDescription>
              Purchase a new phone number to use with your AI agents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="area-code">Area Code</Label>
              <Input
                id="area-code"
                placeholder="e.g., 415"
                maxLength={3}
              />
              <p className="text-sm text-muted-foreground">
                Enter a 3-digit area code to find available numbers in that region.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => purchasePhoneNumber("415")}>
              Search & Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>U.S. Phone Numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$1.00 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
            <p className="text-sm text-muted-foreground mt-2">Per phone number</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inbound Calls</CardTitle>
            <CardDescription>Voice minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$0.005 <span className="text-sm font-normal text-muted-foreground">/minute</span></p>
            <p className="text-sm text-muted-foreground mt-2">For inbound call minutes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Included with all numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlimited agent assignments
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Call recording & transcription
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Webhooks integration
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhoneNumbersSection;
