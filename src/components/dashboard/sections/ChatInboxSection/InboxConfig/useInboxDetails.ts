
import { useState, useEffect } from 'react';
import { chatwootApi } from '@/services/chatwootApi';

export const useInboxDetails = (inboxId: string | number | null) => {
  const [inboxDetails, setInboxDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inboxId) {
      setInboxDetails(null);
      return;
    }

    const fetchInboxDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching inbox details for ID:', inboxId);
        
        const details = await chatwootApi.getInboxDetails(parseInt(inboxId.toString()));
        console.log('Inbox details fetched:', details);
        setInboxDetails(details);
      } catch (err) {
        console.error('Failed to fetch inbox details:', err);
        setError('Failed to load inbox details');
      } finally {
        setLoading(false);
      }
    };

    fetchInboxDetails();
  }, [inboxId]);

  return {
    inboxDetails,
    loading,
    error,
    refetchInboxDetails: () => {
      if (inboxId) {
        const fetchDetails = async () => {
          try {
            setLoading(true);
            const details = await chatwootApi.getInboxDetails(parseInt(inboxId.toString()));
            setInboxDetails(details);
          } catch (err) {
            setError('Failed to reload inbox details');
          } finally {
            setLoading(false);
          }
        };
        fetchDetails();
      }
    }
  };
};
