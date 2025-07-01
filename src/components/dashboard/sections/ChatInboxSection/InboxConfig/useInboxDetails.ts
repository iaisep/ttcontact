
import { useState, useEffect } from 'react';
import { chatwootApi } from '@/services/chatwootApi';

export const useInboxDetails = (inboxId: string | number | null) => {
  const [inboxDetails, setInboxDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInboxDetails = async () => {
      if (!inboxId) {
        setInboxDetails(null);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log('useInboxDetails - Loading details for inbox:', inboxId);
        const numericInboxId = typeof inboxId === 'string' ? parseInt(inboxId) : inboxId;
        
        if (isNaN(numericInboxId)) {
          throw new Error('Invalid inbox ID');
        }

        const details = await chatwootApi.getInboxDetails(numericInboxId);
        console.log('useInboxDetails - Loaded details:', details);
        
        setInboxDetails(details);
      } catch (err) {
        console.error('useInboxDetails - Error loading details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load inbox details');
        setInboxDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadInboxDetails();
  }, [inboxId]);

  return {
    inboxDetails,
    loading,
    error
  };
};
