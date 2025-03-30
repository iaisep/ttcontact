
// Follow this setup guide to integrate the Deno runtime and Supabase
// https://deno.land/manual/examples/supabase

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar el cliente de Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Obtener el usuario actual desde el token de autenticación
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data?.user;

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Obtener el ID de la suscripción desde el cuerpo de la solicitud
    const { subscriptionId } = await req.json();
    
    if (!subscriptionId) {
      throw new Error('No se proporcionó un ID de suscripción');
    }

    // Verificar que la suscripción pertenezca al usuario autenticado
    const { data: subscriptionData, error: fetchError } = await supabaseClient
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!subscriptionData) {
      throw new Error('No se encontró la suscripción o no pertenece al usuario actual');
    }

    // Inicializar Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Cancelar la suscripción en Stripe (al final del período actual)
    await stripe.subscriptions.update(subscriptionData.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
