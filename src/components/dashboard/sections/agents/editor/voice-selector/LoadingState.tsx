
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  isLoading, 
  error, 
  onRetry 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading voices...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-destructive">{error}</p>
        <Button 
          onClick={onRetry}
          variant="link"
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    );
  }

  return null;
};

export default LoadingState;
