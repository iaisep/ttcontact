import { useState } from 'react';
import { toast } from 'sonner';
import { CallDetailInfo, CallHistoryItem } from '../types';
import { useCallDetailsService } from '../services';

export const useCallDetails = () => {
  const { fetchCallDetailsData, fetchAgentDetails } = useCallDetailsService();
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
      
      // Show loading state
      setSelectedCall({ ...callInfo, transcript: 'Loading transcript...' });
      
      // Fetch detailed call information
      const { data: callDetails, success: callSuccess } = await fetchCallDetailsData(callId);
      
      // Fetch agent details if we have an agent ID
      let agentDetails = null;
      if (callInfo.agentId) {
        const { data: agentData } = await fetchAgentDetails(callInfo.agentId);
        agentDetails = agentData;
      }
      
      setSelectedCall({
        ...callInfo,
        ...(callDetails || {}),
        agentDetails
      });
    } catch (error) {
      console.error('Error in call details process:', error);
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
