
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Subscription {
  id: string;
  planName: string;
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: user } = await supabase.auth.getUser();

      if (!user.user) {
        setSubscription(null);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setSubscription({
          id: data.id,
          planName: data.plan_name,
          status: data.status,
          currentPeriodEnd: new Date(data.current_period_end),
          cancelAtPeriodEnd: data.cancel_at_period_end,
        });
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error('Error al obtener la suscripción:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      toast.error('No se pudo cargar la información de suscripción');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!subscription) {
      return { success: false, error: new Error('No hay suscripción activa') };
    }

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          subscriptionId: subscription.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cancelar la suscripción');
      }

      await fetchSubscription();
      toast.success('Tu suscripción se cancelará al final del período actual');
      return { success: true, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      console.error('Error al cancelar la suscripción:', error);
      toast.error(error.message);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription,
    loading,
    error,
    refreshSubscription: fetchSubscription,
    cancelSubscription
  };
};
