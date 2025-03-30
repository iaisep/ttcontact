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
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Loader2, Search, History, Phone, Play, Mic, Download, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { PaginationControls } from '@/components/ui/pagination';

interface Call {
  id: string;
  phone_number: string;
  caller_name?: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'in-progress' | 'failed';
  duration: number;
  agent_id: string;
  recording_url?: string;
  transcript_available: boolean;
  started_at: string;
  ended_at?: string;
}

const CallHistorySection = () => {
  const { fetchWithAuth } = useApiContext();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transcript, setTranscript] = useState<any | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const mockCalls: Call[] = [
    {
      id: '1',
      phone_number: '+14155552671',
      caller_name: 'John Smith',
      direction: 'inbound',
      status: 'completed',
      duration: 126,
      agent_id: 'agent_1',
      recording_url: 'https://example.com/recording1.mp3',
      transcript_available: true,
      started_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      ended_at: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
    },
    {
      id: '2',
      phone_number: '+16505557812',
      caller_name: 'Jane Doe',
      direction: 'outbound',
      status: 'completed',
      duration: 286,
      agent_id: 'agent_2',
      recording_url: 'https://example.com/recording2.mp3',
      transcript_available: true,
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      ended_at: new Date(Date.now() - 1000 * 60 * 60 * 3 + 1000 * 60 * 4).toISOString(),
    },
    {
      id: '3',
      phone_number: '+12125558901',
      direction: 'inbound',
      status: 'failed',
      duration: 15,
      agent_id: 'agent_1',
      transcript_available: false,
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      ended_at: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 15).toISOString(),
    },
    {
      id: '4',
      phone_number: '+19255559072',
      caller_name: 'Bob Johnson',
      direction: 'outbound',
      status: 'completed',
      duration: 312,
      agent_id: 'agent_3',
      recording_url: 'https://example.com/recording4.mp3',
      transcript_available: true,
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      ended_at: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5).toISOString(),
    },
    {
      id: '5',
      phone_number: '+14255551234',
      direction: 'inbound',
      status: 'in-progress',
      duration: 45,
      agent_id: 'agent_2',
      transcript_available: false,
      started_at: new Date(Date.now() - 1000 * 60).toISOString(),
    },
  ];

  useEffect(() => {
    fetchAgents();
    setCalls(mockCalls);
    setLoading(false);
  }, []);

  const fetchAgents = async () => {
    try {
      const data = await fetchWithAuth('/agents');
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      setAgents([
        { id: 'agent_1', name: 'Sales Agent' },
        { id: 'agent_2', name: 'Support Agent' },
        { id: 'agent_3', name: 'Appointment Scheduler' },
      ]);
    }
  };

  const fetchTranscript = async (callId: string) => {
    setTranscriptLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTranscript(mockTranscript);
    } catch (error) {
      console.error('Failed to fetch transcript:', error);
      toast.error('Failed to load transcript');
    } finally {
      setTranscriptLoading(false);
    }
  };

  const viewCallDetails = (call: Call) => {
    setSelectedCall(call);
    setDialogOpen(true);
    if (call.transcript_available) {
      fetchTranscript(call.id);
    } else {
      setTranscript(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'inbound' ? 
      <svg className="h-4 w-4 text-green-600 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      : 
      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7h-12m0 0l4-4m-4 4l4 4m8 6h4m0 0l-4-4m4 4l-4 4" />
      </svg>;
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      call.phone_number.includes(searchQuery) || 
      (call.caller_name && call.caller_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesDirection = true;
    if (activeTab === 'inbound') {
      matchesDirection = call.direction === 'inbound';
    } else if (activeTab === 'outbound') {
      matchesDirection = call.direction === 'outbound';
    }
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().setHours(0, 0, 0, 0);
      const callDate = new Date(call.started_at).setHours(0, 0, 0, 0);
      matchesDate = callDate === today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(call.started_at) >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(call.started_at) >= monthAgo;
    }
    
    return matchesSearch && matchesDirection && matchesDate;
  });

  const paginatedCalls = filteredCalls.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, dateFilter, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Call History</h1>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by phone number or name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <select
              className="h-10 pl-8 pr-3 rounded-md border border-input bg-background min-w-[150px]"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            title="Refresh"
            onClick={() => {
              toast.info("Refreshing call history");
              setLoading(true);
              setTimeout(() => {
                setCalls(mockCalls);
                setLoading(false);
              }, 500);
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Calls</TabsTrigger>
          <TabsTrigger value="inbound">Inbound</TabsTrigger>
          <TabsTrigger value="outbound">Outbound</TabsTrigger>
        </TabsList>
      </Tabs>

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
                  <TableHead>Direction</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCalls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <History className="h-8 w-8 text-muted-foreground" />
                        <p>No call history found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getDirectionIcon(call.direction)}
                          <span className="ml-2 capitalize">{call.direction}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{call.phone_number}</div>
                          {call.caller_name && (
                            <div className="text-xs text-muted-foreground">{call.caller_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {agents.find(a => a.id === call.agent_id)?.name || call.agent_id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{new Date(call.started_at).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(call.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDuration(call.duration)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(call.status)}`}>
                          {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewCallDetails(call)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredCalls.length > 0 && (
            <PaginationControls
              totalItems={filteredCalls.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50]}
            />
          )}
        </>
      )}

      {selectedCall && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Call Details</DialogTitle>
              <DialogDescription>
                Call with {selectedCall.phone_number} {selectedCall.caller_name ? `(${selectedCall.caller_name})` : ''}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Phone Number</Label>
                <p className="font-medium">{selectedCall.phone_number}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Agent</Label>
                <p className="font-medium">
                  {agents.find(a => a.id === selectedCall.agent_id)?.name || selectedCall.agent_id}
                </p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Date & Time</Label>
                <p className="font-medium">
                  {new Date(selectedCall.started_at).toLocaleDateString()}, {' '}
                  {new Date(selectedCall.started_at).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Duration</Label>
                <p className="font-medium">{formatDuration(selectedCall.duration)}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Direction</Label>
                <p className="font-medium capitalize">{selectedCall.direction}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <p className="font-medium capitalize">{selectedCall.status}</p>
              </div>
              
              <div className="col-span-2 space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Recording</Label>
                  {selectedCall.recording_url && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
                
                {selectedCall.recording_url ? (
                  <div className="bg-muted rounded-md p-2">
                    <audio controls className="w-full">
                      <source src={selectedCall.recording_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div className="bg-muted rounded-md p-4 text-center text-muted-foreground">
                    No recording available for this call
                  </div>
                )}
              </div>
              
              <div className="col-span-2 space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Transcript</Label>
                  {transcript && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
                
                {transcriptLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : transcript ? (
                  <div className="bg-muted rounded-md p-4 h-64 overflow-y-auto space-y-4">
                    {transcript.turns.map((turn: any, i: number) => (
                      <div key={i} className={`flex gap-3 ${turn.speaker === 'agent' ? 'justify-end' : ''}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] space-y-1 ${
                          turn.speaker === 'agent' 
                            ? 'bg-primary text-primary-foreground order-2' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          <div className="font-medium text-xs">
                            {turn.speaker === 'agent' 
                              ? agents.find(a => a.id === selectedCall.agent_id)?.name || 'Agent' 
                              : selectedCall.caller_name || 'Caller'}
                          </div>
                          <p className="text-sm">{turn.text}</p>
                          <div className="text-xs opacity-70 text-right">{turn.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted rounded-md p-4 text-center text-muted-foreground">
                    No transcript available for this call
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CallHistorySection;
