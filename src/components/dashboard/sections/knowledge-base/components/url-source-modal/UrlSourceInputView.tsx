
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'lucide-react';

interface UrlSourceInputViewProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

const UrlSourceInputView: React.FC<UrlSourceInputViewProps> = ({
  url,
  setUrl,
  isLoading,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">URL Address</h3>
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          className="w-20"
        >
          Cancel
        </Button>
        <Button 
          onClick={() => onSubmit()} 
          disabled={isLoading || !url}
          className="w-20 bg-black text-white hover:bg-black/80"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UrlSourceInputView;
