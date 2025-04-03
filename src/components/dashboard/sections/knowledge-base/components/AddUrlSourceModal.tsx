
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { WebPage } from '../types';

interface AddUrlSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string, autoSync: boolean, selectedPages: WebPage[]) => Promise<void>;
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
}

const AddUrlSourceModal: React.FC<AddUrlSourceModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onFetchSitemap
}) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [autoSync, setAutoSync] = useState(false);
  const [webPages, setWebPages] = useState<WebPage[]>([]);
  const [sitemapDialogOpen, setSitemapDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setSourceUrl('');
    setAutoSync(false);
    setWebPages([]);
    setSitemapDialogOpen(false);
  };

  const handleFetchSitemap = async () => {
    if (!sourceUrl) return;
    
    try {
      setLoading(true);
      const pages = await onFetchSitemap(sourceUrl);
      setWebPages(pages);
      setSitemapDialogOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(sourceUrl, autoSync, webPages.filter(p => p.selected));
      handleReset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleWebPageSelection = (index: number) => {
    const updatedPages = [...webPages];
    updatedPages[index].selected = !updatedPages[index].selected;
    setWebPages(updatedPages);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) handleReset();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        {!sitemapDialogOpen ? (
          <>
            <DialogHeader>
              <DialogTitle>Add Web Pages</DialogTitle>
              <DialogDescription>
                Enter a website URL to extract content from its sitemap.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="url">Website URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    onClick={handleFetchSitemap}
                    disabled={!sourceUrl || loading}
                  >
                    <Search className="h-4 w-4 mr-1" /> Scan
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the root URL of the website to scan its sitemap.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="auto-sync" 
                  checked={autoSync}
                  onCheckedChange={(checked) => setAutoSync(checked === true)}
                />
                <Label htmlFor="auto-sync" className="text-sm cursor-pointer">
                  Auto sync web pages every 24 hours
                </Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  handleReset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleSubmit}
                disabled={!sourceUrl}
              >
                Add
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Select Web Pages</DialogTitle>
              <DialogDescription>
                Select which pages from {sourceUrl} you want to include in your knowledge base.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                {webPages.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No pages found in the sitemap.
                  </div>
                ) : (
                  webPages.map((page, index) => (
                    <div 
                      key={page.url}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleWebPageSelection(index)}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={page.selected}
                          onCheckedChange={() => toggleWebPageSelection(index)}
                          id={`page-${index}`}
                        />
                        <Label 
                          htmlFor={`page-${index}`}
                          className="text-sm cursor-pointer"
                        >
                          {page.title || page.url}
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {page.url}
                      </span>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  {webPages.filter(p => p.selected).length} of {webPages.length} pages selected
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWebPages(webPages.map(p => ({...p, selected: false})))}
                  >
                    Deselect All
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWebPages(webPages.map(p => ({...p, selected: true})))}
                  >
                    Select All
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sitemap-auto-sync" 
                  checked={autoSync}
                  onCheckedChange={(checked) => setAutoSync(checked === true)}
                />
                <Label htmlFor="sitemap-auto-sync" className="text-sm cursor-pointer">
                  Auto sync web pages every 24 hours
                </Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setSitemapDialogOpen(false)}
              >
                Back
              </Button>
              <Button 
                type="button"
                onClick={handleSubmit}
                disabled={webPages.filter(p => p.selected).length === 0}
              >
                Add Selected Pages
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlSourceModal;
