
import { PaymentMethod } from '../types';
import { loadStripe } from '@stripe/stripe-js';

// Stripe public key - actualiza esto con tu clave pública real de Stripe
const STRIPE_PUBLIC_KEY = 'pk_test_51NwgafILRXVQgZJ4IwjVfhxoaX2QOKQf3owTKwJu9DKk0WcHtLyOEBZHmjvh0MeKXmGGIpuBBCTns11ReBGiTgQW00FfARfGI7';

// Inicializar Stripe
export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// Producto Stripe configurado
export const STRIPE_PRODUCT_ID = 'prod_S2XqigZAJV7SP5';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Función para crear un método de pago en Stripe
export const createPaymentMethod = async (stripe: any, elements: any) => {
  if (!stripe || !elements) {
    throw new Error('Stripe no ha sido inicializado correctamente');
  }

  const cardElement = elements.getElement('card');
  
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    throw new Error(error.message);
  }

  return paymentMethod;
};

// Función para establecer como predeterminado un método de pago
export const setDefaultPaymentMethod = async (paymentMethodId: string) => {
  try {
    // En una implementación real, esto sería una llamada a la API
    const response = await fetch('/api/payment-methods/set-default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentMethodId }),
    });

    if (!response.ok) {
      throw new Error('Error al establecer el método de pago predeterminado');
    }

    return true;
  } catch (error) {
    console.error('Error al establecer el método de pago predeterminado:', error);
    throw error;
  }
};

// Función para eliminar un método de pago
export const deletePaymentMethod = async (paymentMethodId: string) => {
  try {
    // En una implementación real, esto sería una llamada a la API
    const response = await fetch('/api/payment-methods/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentMethodId }),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el método de pago');
    }

    return true;
  } catch (error) {
    console.error('Error al eliminar el método de pago:', error);
    throw error;
  }
};

// Función para configurar recarga automática
export const setupAutoRecharge = async (threshold: number, amount: number) => {
  try {
    // En una implementación real, esto sería una llamada a la API
    const response = await fetch('/api/billing/auto-recharge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threshold, amount }),
    });

    if (!response.ok) {
      throw new Error('Error al configurar la recarga automática');
    }

    return true;
  } catch (error) {
    console.error('Error al configurar la recarga automática:', error);
    throw error;
  }
};

// Mapear un PaymentMethod de Stripe a nuestro formato interno
export const mapStripePaymentMethod = (stripePaymentMethod: any): PaymentMethod => {
  return {
    id: stripePaymentMethod.id,
    brand: stripePaymentMethod.card.brand,
    last4: stripePaymentMethod.card.last4,
    expMonth: stripePaymentMethod.card.exp_month,
    expYear: stripePaymentMethod.card.exp_year,
    isDefault: stripePaymentMethod.isDefault || false,
  };
};
