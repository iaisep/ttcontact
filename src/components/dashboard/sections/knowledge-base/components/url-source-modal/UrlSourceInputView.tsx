
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UrlSourceInputViewProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

const UrlSourceInputView: React.FC<UrlSourceInputViewProps> = ({
  url,
  setUrl,
  isLoading,
  error,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">URL Address</h3>
        <div className="flex gap-2 items-center">
          <div className="flex-grow flex rounded-md border border-input focus-within:ring-1 focus-within:ring-offset-1 focus-within:ring-ring">
            <div className="px-3 py-2 flex items-center bg-gray-50 border-r text-gray-500">
              <Link className="h-4 w-4" />
            </div>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-transparent"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter a website URL to fetch its pages
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
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
          disabled={isLoading || !url.trim()}
          className="w-20 bg-black text-white hover:bg-black/80"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Loading
            </span>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  );
};

export default UrlSourceInputView;
