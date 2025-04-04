
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface UrlInputViewProps {
  url: string;
  setUrl: (url: string) => void;
  error: string | null;
  isLoading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  knowledgeBaseName?: string;
}

const UrlInputView: React.FC<UrlInputViewProps> = ({
  url,
  setUrl,
  error,
  isLoading,
  onSubmit,
  onCancel,
  knowledgeBaseName
}) => {
  return (
    <div className="space-y-4">
      {knowledgeBaseName && (
        <div className="text-sm text-muted-foreground">
          Adding URL to: <span className="font-medium">{knowledgeBaseName}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className={error ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Enter the URL of the website you want to add as a knowledge source
        </p>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!url || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  );
};

export default UrlInputView;
