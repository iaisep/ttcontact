
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogFooter } from '@/components/ui/dialog';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

interface UrlInputViewProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: () => Promise<void>;
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
  const { fetchWithAuth } = useApiContext();
  
  const handleFetchSitemap = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    
    try {
      // Format URL if needed
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      toast.info('Fetching sitemap data...', {
        duration: 3000
      });
      
      // Make only ONE request to the list-sitemap endpoint
      const response = await fetchWithAuth('/list-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website_url: formattedUrl }),
      });
      
      console.log('Sitemap API response received:', response);
      
      // Store the response data in localStorage so we can use it in the next step
      if (response && Array.isArray(response)) {
        localStorage.setItem('sitemap_pages', JSON.stringify(response));
      }
      
      // After getting the response, proceed with the regular flow
      onSubmit();
      
    } catch (error) {
      console.error('Failed to fetch sitemap:', error);
      toast.error('Failed to fetch sitemap. You can still proceed to create a knowledge base.');
      
      // Even if there's an error, we still proceed to the next step
      // This allows users to create a knowledge base even when sitemap fetch fails
      onSubmit();
    }
  };

  return (
    <div className="space-y-4 p-6">
      {knowledgeBaseName && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-md mb-2">
          <Info className="h-4 w-4" />
          <span className="text-sm">Adding to knowledge base: <strong>{knowledgeBaseName}</strong></span>
        </div>
      )}
      
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
      
      <DialogFooter className="mt-6">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleFetchSitemap} 
          disabled={isLoading || !url.trim()}
          className="bg-black text-white hover:bg-black/80"
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
      </DialogFooter>
    </div>
  );
};

export default UrlInputView;
