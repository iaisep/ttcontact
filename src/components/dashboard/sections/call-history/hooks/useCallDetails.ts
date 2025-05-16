
import { useState } from 'react';
import { toast } from 'sonner';
import { CallDetailInfo, CallHistoryItem } from '../types';
import { useCallDetailsService } from '../services';
import { useAgentDetailsService } from '../services/agentDetailsService';

export const useCallDetails = () => {
  const { fetchCallDetailsData } = useCallDetailsService();
  const { fetchAgentDetails } = useAgentDetailsService();
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
      
      // Log what we received from the call details API for debugging
      console.log('Call details received:', callDetails);
      
      // Fetch agent details if we have an agent ID
      let agentDetails = null;
      if (callInfo.agentId) {
        const { data: agentData } = await fetchAgentDetails(callInfo.agentId);
        agentDetails = agentData;
      }
      
      // Prioritize call_summary from the API response
      const summaryData = {
        call_summary: callDetails?.call_summary || callInfo.call_summary || '',
        resumen_2da_llamada: callDetails?.resumen_2da_llamada || callInfo.resumen_2da_llamada || ''
      };
      
      console.log('Setting selected call with summary data:', summaryData);
      
      setSelectedCall({
        ...callInfo,
        ...(callDetails || {}),
        ...summaryData,
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
