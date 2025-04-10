
import { PaymentMethod } from '../types';
import { loadStripe } from '@stripe/stripe-js';

// Stripe public key
const STRIPE_PUBLIC_KEY = 'pk_test_51NwgafILRXVQgZJ4IwjVfhxoaX2QOKQf3owTKwJu9DKk0WcHtLyOEBZHmjvh0MeKXmGGIpuBBCTns11ReBGiTgQW00FfARfGI7';

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// Stripe product ID
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
    case 'ongoing':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Function to create a payment method in Stripe
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

// Function to set a payment method as default
export const setDefaultPaymentMethod = async (paymentMethodId: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

// Function to delete a payment method
export const deletePaymentMethod = async (paymentMethodId: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

// Function to set up automatic recharge
export const setupAutoRecharge = async (threshold: number, amount: number) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error setting up auto-recharge:', error);
    throw error;
  }
};

// Map a Stripe PaymentMethod to our internal format
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
