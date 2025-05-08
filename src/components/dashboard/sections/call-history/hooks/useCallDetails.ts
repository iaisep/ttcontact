
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { CallDetailInfo, CallHistoryItem } from '../types';

export const useCallDetails = () => {
  const { fetchWithAuth } = useApiContext();
  const [selectedCall, setSelectedCall] = useState<CallDetailInfo | null>(null);

  // Function to fetch call details when a call is selected
  const fetchCallDetails = async (callId: string, callHistory: CallHistoryItem[]) => {
    try {
      // Find the basic call info from our existing data
      const callInfo = callHistory.find(call => call.callId === callId);
      
      if (!callInfo) {
        toast.error('Call information not found');
        return;
      }
      
      setSelectedCall({ ...callInfo, transcript: 'Loading transcript...' });
      
      // Fetch detailed call info using POST method
      const callDetails = await fetchWithAuth(`/v2/get-call-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ callId })
      });
      
      // Fetch agent details if we have an agent ID
      let agentDetails = null;
      if (callInfo.agentId) {
        const agentResponse = await fetchWithAuth(`/list-agents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: callInfo.agentId })
        });
        
        if (agentResponse && agentResponse.length > 0) {
          agentDetails = agentResponse[0];
        }
      }
      
      setSelectedCall({
        ...callInfo,
        ...callDetails,
        agentDetails
      });
    } catch (error) {
      console.error('Error fetching call details:', error);
      toast.error('Failed to fetch call details');
      
      // Keep the basic info we have
      if (callHistory.find(call => call.callId === callId)) {
        setSelectedCall({
          ...callHistory.find(call => call.callId === callId)!,
          transcript: 'Transcript not available'
        });
      }
    }
  };

  // Close call details
  const closeCallDetails = () => {
    setSelectedCall(null);
  };

  return {
    selectedCall,
    fetchCallDetails,
    closeCallDetails
  };
};
