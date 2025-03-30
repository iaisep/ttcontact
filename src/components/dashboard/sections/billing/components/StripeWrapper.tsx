
import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../utils/BillingUtils';

interface StripeWrapperProps {
  children: ReactNode;
}

const StripeWrapper = ({ children }: StripeWrapperProps) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;
