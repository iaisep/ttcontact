
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="bg-muted/30 px-4 py-2 border-b">
        <span className="text-sm font-medium">Welcome Message</span>
      </div>
      <div className="p-4 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
};

export default LoadingState;
