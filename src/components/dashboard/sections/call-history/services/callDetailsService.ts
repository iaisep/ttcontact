
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

/**
 * Service for handling call details API operations
 */
export const useCallDetailsService = () => {
  const { fetchWithAuth } = useApiContext();

  /**
   * Fetch detailed information about a specific call
   * @param callId The ID of the call to get details for
   * @returns Call details response or error information
   */
  const fetchCallDetailsData = async (callId: string) => {
    try {
      // Use GET endpoint to fetch call details
      const callDetails = await fetchWithAuth(`/v2/get-call/${callId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return {
        data: callDetails,
        success: true
      };
    } catch (error) {
      console.error('Error fetching call details:', error);
      toast.error('Failed to fetch call details');
      return {
        data: null,
        success: false
      };
    }
  };

  return {
    fetchCallDetailsData
  };
};
