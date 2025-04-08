
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Phone, Plus, RefreshCw } from 'lucide-react';
import PhoneNumbersList from './phone-numbers/PhoneNumbersList';
import PhoneDetailView from './phone-numbers/PhoneDetailView';
import { usePhoneNumbers } from './phone-numbers/hooks/usePhoneNumbers';
import { useAgents } from './phone-numbers/hooks/useAgents';
import PurchaseDialog from './phone-numbers/dialogs/PurchaseDialog';
import SipDialog from './phone-numbers/dialogs/SipDialog';
import EmptyState from './phone-numbers/EmptyState';
import LoadingState from './phone-numbers/LoadingState';
import { PhoneNumber } from './phone-numbers/hooks/types';

const PhoneNumbersSection = () => {
  const { 
    phoneNumbers, 
    selectedPhoneId,
    setSelectedPhoneId, 
    loading: phoneLoading, 
    error, 
    fetchPhoneNumbers,
    purchasePhoneNumber,
    releasePhoneNumber,
    updatePhoneName,
    updateWebhook,
    assignAgent
  } = usePhoneNumbers();
  
  const { agents, loading: agentLoading, error: agentError, fetchAgents } = useAgents();
  
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [sipDialogOpen, setSipDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Initial data fetch
  useEffect(() => {
    console.log('PhoneNumbersSection: Initial data fetch');
    fetchPhoneNumbers();
    fetchAgents();
  }, [fetchPhoneNumbers, fetchAgents]);

  // Log agents data every time it changes for debugging
  useEffect(() => {
    console.log('PhoneNumbersSection: Agents data updated:', agents);
  }, [agents]);

  // Log phone numbers data every time it changes for debugging
  useEffect(() => {
    console.log('PhoneNumbersSection: PhoneNumbers data updated:', phoneNumbers);
  }, [phoneNumbers]);

  // Handle refreshing both phone numbers and agents data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchPhoneNumbers(),
        fetchAgents()
      ]);
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const connectSipNumber = async (sipUri: string, nickname: string) => {
    try {
      // This would be implemented with the right API endpoint
      toast.success('SIP trunking connection will be implemented soon');
    } catch (error) {
      toast.error('Failed to connect SIP trunking');
      console.error(error);
    }
  };

  const selectedPhone = phoneNumbers.find(phone => phone.id === selectedPhoneId);
  
  // Show loading state while fetching data
  if (phoneLoading || agentLoading) {
    return <LoadingState />;
  }

  // Render empty state if there are no phone numbers or there was an error
  if ((phoneNumbers.length === 0 && !phoneLoading) || error) {
    return (
      <div className="h-full">
        <div className="flex border rounded-md overflow-hidden h-full">
          <PhoneNumbersList 
            phoneNumbers={[]}
            selectedPhoneId={null}
            onSelectPhone={() => {}}
            onAddClick={() => setPurchaseDialogOpen(true)}
            onBuyNewClick={() => setPurchaseDialogOpen(true)}
            onConnectSIPClick={() => setSipDialogOpen(true)}
          />
          
          <EmptyState onAddPhoneNumber={() => setPurchaseDialogOpen(true)} />
        </div>

        <PurchaseDialog 
          open={purchaseDialogOpen}
          onOpenChange={setPurchaseDialogOpen}
          onPurchase={purchasePhoneNumber}
        />
        
        <SipDialog
          open={sipDialogOpen}
          onOpenChange={setSipDialogOpen}
          onConnect={connectSipNumber}
        />
      </div>
    );
  }

  // Regular view with phone numbers
  return (
    <div className="h-full">
      <div className="flex border rounded-md overflow-hidden h-full">
        <PhoneNumbersList 
          phoneNumbers={phoneNumbers}
          selectedPhoneId={selectedPhoneId}
          onSelectPhone={(phone) => setSelectedPhoneId(phone.id)}
          onAddClick={() => setPurchaseDialogOpen(true)}
          onBuyNewClick={() => setPurchaseDialogOpen(true)}
          onConnectSIPClick={() => setSipDialogOpen(true)}
        />
        
        <div className="flex-grow p-6">
          {selectedPhone ? (
            <PhoneDetailView 
              phone={selectedPhone}
              agents={agents || []} // Ensure agents is always an array even if undefined
              loading={{ agents: agentLoading, phones: phoneLoading }}
              onAssignAgent={assignAgent}
              onDeletePhone={releasePhoneNumber}
              onUpdatePhoneName={updatePhoneName}
              onUpdateWebhook={updateWebhook}
              onRefresh={handleRefresh}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <h3 className="text-lg font-medium">No phone number selected</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Select a phone number from the list or add a new one to configure its settings.
              </p>
              <Button onClick={() => setPurchaseDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Phone Number
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <PurchaseDialog 
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        onPurchase={purchasePhoneNumber}
      />
      
      <SipDialog
        open={sipDialogOpen}
        onOpenChange={setSipDialogOpen}
        onConnect={connectSipNumber}
      />
    </div>
  );
};

export default PhoneNumbersSection;
