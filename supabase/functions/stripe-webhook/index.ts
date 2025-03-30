
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

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
  });

  // Inicializar el cliente de Supabase
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  try {
    // Obtener la firma del evento de Stripe
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      throw new Error('No se proporcionó la firma de Stripe');
    }

    // Obtener el cuerpo de la solicitud como texto
    const body = await req.text();
    
    // Verificar la firma del evento
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log(`Evento recibido: ${event.type}`);

    // Manejar eventos específicos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, supabaseClient, stripe);
        break;
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object, supabaseClient);
        break;
        
      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

// Función para manejar el evento checkout.session.completed
async function handleCheckoutSessionCompleted(session: any, supabase: any, stripe: any) {
  // Verificar que sea un pago de suscripción
  if (session.mode !== 'subscription') {
    return;
  }

  try {
    // Obtener los detalles de la suscripción
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
    // Obtener los metadatos de la sesión
    const userId = session.metadata?.userId;
    const planName = session.metadata?.planName || 'Plan desconocido';
    
    if (!userId) {
      throw new Error('No se encontró el ID de usuario en los metadatos');
    }

    // Guardar la suscripción en la base de datos
    const { error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          stripe_price_id: subscription.items.data[0].price.id,
          plan_name: planName,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        },
      ]);

    if (error) {
      throw error;
    }

    console.log(`Suscripción creada para el usuario ${userId}`);
  } catch (error) {
    console.error('Error al procesar la suscripción:', error);
    throw error;
  }
}

// Función para manejar cambios en la suscripción
async function handleSubscriptionChange(subscription: any, supabase: any) {
  try {
    // Buscar la suscripción en la base de datos
    const { data: subscriptionData, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscription.id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!subscriptionData) {
      console.log(`No se encontró la suscripción ${subscription.id} en la base de datos`);
      return;
    }

    // Actualizar la suscripción en la base de datos
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', subscription.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Suscripción ${subscription.id} actualizada`);
  } catch (error) {
    console.error('Error al actualizar la suscripción:', error);
    throw error;
  }
}
