
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { CallCounts } from '../types';

/**
 * This hook contains the original fetchCallCountsData function preserved for reference
 * It's not called anymore to prevent the API call
 */
export const useDashboardData = () => {
  const { apiKey } = useApiContext();
  
  const fetchCallCountsData = async (): Promise<CallCounts | null> => {
    console.log("fetchCallCountsData function preserved but not called");
    
    // Original implementation commented out to prevent the API call
    /*
    try {
      const payload = {
        size: "small",
        filter: [],
        unit: "day",
        comparison: true,
        show: [
          {
            measurement: {
              type: "count"
            },
            source: {
              type: "call_id"
            }
          }
        ],
        time: {
          type: "since",
          value: [1743476400000]
        },
        title: "Call Counts",
        type: "number",
        id: 0.596305120479717,
        group: []
      };

      // Try using the fetchWithAuth method first which handles API key automatically
      const response = await fetch("https://api.retellai.com/fetch-dashboard-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        referrerPolicy: "no-referrer"
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Dashboard data response:", data);
      return data;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load call count data");
      return null;
    }
    */
    return null;
  };

  return {
    fetchCallCountsData
  };
};
