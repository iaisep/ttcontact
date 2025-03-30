
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
    const { priceId, planName } = await req.json();
    
    // Validar que se haya proporcionado un priceId
    if (!priceId) {
      throw new Error('No se proporcionó un ID de precio');
    }

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

    // Inicializar Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Buscar si el usuario ya tiene un cliente en Stripe
    let customerId = null;
    const { data: existingCustomers, error: customerError } = await supabaseClient
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (customerError) {
      console.error('Error al buscar cliente existente:', customerError);
    }

    // Si el usuario no tiene un cliente en Stripe, crear uno nuevo
    if (!existingCustomers?.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUid: user.id,
        },
      });
      
      customerId = customer.id;
      
      // Guardar el ID del cliente en la base de datos
      const { error: insertError } = await supabaseClient
        .from('customers')
        .insert([
          {
            user_id: user.id,
            stripe_customer_id: customerId,
          },
        ]);
        
      if (insertError) {
        console.error('Error al guardar cliente:', insertError);
      }
    } else {
      customerId = existingCustomers.stripe_customer_id;
    }

    // Crear la sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?checkout_success=true`,
      cancel_url: `${req.headers.get('origin')}/pricing?checkout_canceled=true`,
      metadata: {
        userId: user.id,
        planName: planName || 'Plan desconocido',
      },
    });

    // Devolver la URL de la sesión de checkout
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
