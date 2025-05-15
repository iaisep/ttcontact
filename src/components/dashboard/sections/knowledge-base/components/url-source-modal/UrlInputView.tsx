
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

interface UrlInputViewProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: () => void;
  onCancel: () => void;
  knowledgeBaseName?: string;
}

const UrlInputView: React.FC<UrlInputViewProps> = ({
  url,
  setUrl,
  isLoading,
  error,
  onSubmit,
  onCancel,
  knowledgeBaseName
}) => {
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="p-6">
      {knowledgeBaseName && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-md mb-6">
          <Info className="h-4 w-4" />
          <span className="text-sm">Adding to knowledge base: <strong>{knowledgeBaseName}</strong></span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-1">
              Enter website URL
            </label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={error ? "border-red-500" : ""}
              onKeyDown={handleInputKeyDown}
              autoFocus
              disabled={isLoading}
              autoComplete="url"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          
          <p className="text-xs text-gray-500">
            We'll scan the website and add its content to your knowledge base.
          </p>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!url.trim() || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UrlInputView;
