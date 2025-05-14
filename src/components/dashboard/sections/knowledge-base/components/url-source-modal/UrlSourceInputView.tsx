
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface UrlSourceInputViewProps {
  url: string;
  setUrl: (url: string) => void;
  autoSync: boolean;
  setAutoSync: (autoSync: boolean) => void;
  knowledgeBaseName?: string;
  isNewKnowledgeBase: boolean;
  onFetchSitemap: () => void;
  onAddUrl: () => void;
  onCancel: () => void;
  isLoading: boolean;
  error?: string | null;
}

const UrlSourceInputView: React.FC<UrlSourceInputViewProps> = ({
  url,
  setUrl,
  autoSync,
  setAutoSync,
  knowledgeBaseName,
  isNewKnowledgeBase,
  onFetchSitemap,
  onAddUrl,
  onCancel,
  isLoading,
  error
}) => {
  return (
    <div className="space-y-4 py-4">
      {isNewKnowledgeBase && knowledgeBaseName && (
        <div className="bg-blue-50 p-3 rounded-md text-blue-800 text-sm mb-4">
          Adding to new knowledge base: <strong>{knowledgeBaseName}</strong>
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium">
          Enter website URL
        </label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={isLoading}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto-sync"
          checked={autoSync}
          onCheckedChange={setAutoSync}
          disabled={isLoading}
        />
        <label
          htmlFor="auto-sync"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Automatically sync content (daily)
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onFetchSitemap} disabled={isLoading || !url}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Find Pages'
          )}
        </Button>
      </div>
    </div>
  );
};

export default UrlSourceInputView;
