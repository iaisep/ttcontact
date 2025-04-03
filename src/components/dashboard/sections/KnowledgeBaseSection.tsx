import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  BookText, 
  RefreshCw, 
  Globe, 
  FileText, 
  File, 
  X, 
  Check,
  RefreshCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { PaginationControls } from '@/components/ui/pagination';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  agent_id?: string;
  created_at: string;
  updated_at: string;
}

interface KnowledgeBase {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  source_count: number;
  sources: KnowledgeBaseSource[];
  auto_sync?: boolean;
}

interface KnowledgeBaseSource {
  id: string;
  type: 'url' | 'file' | 'text';
  title: string;
  content?: string;
  url?: string;
  file_name?: string;
  created_at: string;
  auto_sync?: boolean;
}

interface WebPage {
  url: string;
  title: string;
  selected: boolean;
}

const KnowledgeBaseSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [kbDialogOpen, setKbDialogOpen] = useState(false);
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false);
  const [sitemapDialogOpen, setSitemapDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentKb, setCurrentKb] = useState<KnowledgeBase | null>(null);
  const [currentSourceType, setCurrentSourceType] = useState<'url' | 'file' | 'text' | null>(null);
  const [currentSource, setCurrentSource] = useState<KnowledgeBaseSource | null>(null);
  const [webPages, setWebPages] = useState<WebPage[]>([]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [autoSync, setAutoSync] = useState(false);
  const [sourceFileName, setSourceFileName] = useState('');
  const [sourceContent, setSourceContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSourceDialogOpen, setDeleteSourceDialogOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<KnowledgeBaseSource | null>(null);
  const [kbToDelete, setKbToDelete] = useState<KnowledgeBase | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form for knowledge base name
  const kbForm = useForm({
    defaultValues: {
      name: '',
    }
  });

  useEffect(() => {
    fetchKnowledgeBases();
    fetchAgents();
  }, []);

  const fetchKnowledgeBases = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be replaced with /list-knowledge-bases
      const mockData: KnowledgeBase[] = [
        {
          id: 'kb_123456',
          name: 'Product Documentation',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          source_count: 3,
          sources: [
            {
              id: 'src_123',
              type: 'url',
              title: 'Product Homepage',
              url: 'https://example.com/products',
              created_at: new Date().toISOString(),
            },
            {
              id: 'src_124',
              type: 'file',
              title: 'User Manual',
              file_name: 'user_manual.pdf',
              created_at: new Date().toISOString(),
            },
            {
              id: 'src_125',
              type: 'text',
              title: 'API Overview',
              content: 'Our API uses REST principles and returns JSON responses.',
              created_at: new Date().toISOString(),
            }
          ],
          auto_sync: false
        },
        {
          id: 'kb_789012',
          name: 'Customer FAQs',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          source_count: 1,
          sources: [
            {
              id: 'src_789',
              type: 'text',
              title: 'Common Questions',
              content: 'Q: How do I reset my password? A: Visit the login page and click "Forgot Password".',
              created_at: new Date().toISOString(),
            }
          ],
          auto_sync: false
        }
      ];
      
      setKnowledgeBases(mockData);
    } catch (error) {
      toast.error('Failed to fetch knowledge bases');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await fetchWithAuth('/list-agents');
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const handleCreateKnowledgeBase = async () => {
    const { name } = kbForm.getValues();
    
    if (!name.trim()) {
      toast.error('Please enter a knowledge base name');
      return;
    }
    
    try {
      setLoading(true);
      // In a real implementation, this would be:
      // const response = await fetchWithAuth('/create-knowledge-base', {
      //   method: 'POST',
      //   body: JSON.stringify({ name }),
      // });
      
      // Mock the response
      const newKb: KnowledgeBase = {
        id: `kb_${Date.now()}`,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_count: 0,
        sources: [],
        auto_sync: false
      };
      
      setKnowledgeBases([...knowledgeBases, newKb]);
      setCurrentKb(newKb);
      toast.success('Knowledge base created');
      kbForm.reset();
      setKbDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create knowledge base');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async () => {
    if (!currentKb) return;
    
    try {
      setLoading(true);
      let newSource: KnowledgeBaseSource | null = null;
      
      if (currentSourceType === 'url') {
        // In a real implementation, this would be:
        // const response = await fetchWithAuth(`/add-knowledge-base-sources/${currentKb.id}`, {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     knowledge_base_urls: webPages.filter(wp => wp.selected).map(wp => wp.url),
        //     auto_sync: autoSync
        //   }),
        // });
        
        // Mock the response
        newSource = {
          id: `src_url_${Date.now()}`,
          type: 'url',
          title: sourceUrl,
          url: sourceUrl,
          created_at: new Date().toISOString(),
          auto_sync: autoSync
        };
      } else if (currentSourceType === 'file' && selectedFile) {
        // In a real implementation, this would use FormData to upload the file
        // const formData = new FormData();
        // formData.append('knowledge_base_files', selectedFile);
        // const response = await fetchWithAuth(`/add-knowledge-base-sources/${currentKb.id}`, {
        //   method: 'POST',
        //   body: formData,
        // });
        
        // Mock the response
        newSource = {
          id: `src_file_${Date.now()}`,
          type: 'file',
          title: selectedFile.name,
          file_name: selectedFile.name,
          created_at: new Date().toISOString()
        };
      } else if (currentSourceType === 'text') {
        // In a real implementation, this would be:
        // const response = await fetchWithAuth(`/add-knowledge-base-sources/${currentKb.id}`, {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     knowledge_base_texts: [
        //       {
        //         title: sourceFileName,
        //         text: sourceContent
        //       }
        //     ]
        //   }),
        // });
        
        // Mock the response
        newSource = {
          id: `src_text_${Date.now()}`,
          type: 'text',
          title: sourceFileName,
          content: sourceContent,
          created_at: new Date().toISOString()
        };
      }
      
      if (newSource) {
        const updatedKb = {...currentKb};
        updatedKb.sources = [...updatedKb.sources, newSource];
        updatedKb.source_count = updatedKb.sources.length;
        
        if (currentSourceType === 'url' && autoSync) {
          updatedKb.auto_sync = true;
        }
        
        setKnowledgeBases(knowledgeBases.map(kb => 
          kb.id === currentKb.id ? updatedKb : kb
        ));
        
        setCurrentKb(updatedKb);
        toast.success('Source added to knowledge base');
      }
      
      // Reset form fields
      setSourceUrl('');
      setSourceFileName('');
      setSourceContent('');
      setSelectedFile(null);
      setWebPages([]);
      setAutoSync(false); // Reset auto sync option
      setSourceDialogOpen(false);
      setSitemapDialogOpen(false);
      setCurrentSourceType(null);
    } catch (error) {
      toast.error('Failed to add source to knowledge base');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSitemap = async () => {
    if (!sourceUrl) {
      toast.error('Please enter a URL');
      return;
    }
    
    try {
      setLoading(true);
      // In a real implementation, this would be:
      // const response = await fetchWithAuth('/list-sitemap', {
      //   method: 'POST',
      //   body: JSON.stringify({ website_url: sourceUrl }),
      // });
      // const pages = response.pages || [];
      
      // Mock the response
      const mockPages = [
        { url: `${sourceUrl}/about`, title: 'About Us', selected: false },
        { url: `${sourceUrl}/products`, title: 'Products', selected: false },
        { url: `${sourceUrl}/contact`, title: 'Contact', selected: false },
        { url: `${sourceUrl}/blog`, title: 'Blog', selected: false }
      ];
      
      setWebPages(mockPages);
      setSitemapDialogOpen(true);
    } catch (error) {
      toast.error('Failed to fetch sitemap');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKnowledgeBase = async () => {
    if (!kbToDelete) return;
    
    try {
      setLoading(true);
      // In a real implementation, this would be:
      // await fetchWithAuth(`/delete-knowledge-base/${kbToDelete.id}`, {
      //   method: 'DELETE',
      // });
      
      // Update state
      setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== kbToDelete.id));
      toast.success('Knowledge base deleted');
      setDeleteDialogOpen(false);
      setKbToDelete(null);
    } catch (error) {
      toast.error('Failed to delete knowledge base');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSource = async () => {
    if (!currentKb || !sourceToDelete) return;
    
    try {
      setLoading(true);
      // In a real implementation, this would be:
      // await fetchWithAuth(`/delete-knowledge-base-source/${currentKb.id}/source/${sourceToDelete.id}`, {
      //   method: 'DELETE',
      // });
      
      // Update state
      const updatedKb = {...currentKb};
      updatedKb.sources = updatedKb.sources.filter(src => src.id !== sourceToDelete.id);
      updatedKb.source_count = updatedKb.sources.length;
      
      setKnowledgeBases(knowledgeBases.map(kb => 
        kb.id === currentKb.id ? updatedKb : kb
      ));
      
      setCurrentKb(updatedKb);
      toast.success('Source deleted from knowledge base');
      setDeleteSourceDialogOpen(false);
      setSourceToDelete(null);
    } catch (error) {
      toast.error('Failed to delete source');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResyncKnowledgeBase = async (kb: KnowledgeBase) => {
    try {
      setLoading(true);
      // Find URL sources to resync
      const urlSources = kb.sources.filter(src => src.type === 'url');
      
      if (urlSources.length === 0) {
        toast.error('No URL sources to resync');
        return;
      }
      
      // For each URL source, re-fetch sitemap
      for (const source of urlSources) {
        if (source.url) {
          // In a real implementation, this would be:
          // await fetchWithAuth('/list-sitemap', {
          //   method: 'POST',
          //   body: JSON.stringify({ website_url: source.url }),
          // });
          // Then update the source with new data
        }
      }
      
      toast.success('Knowledge base resynced');
    } catch (error) {
      toast.error('Failed to resync knowledge base');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleKbFormReset = () => {
    kbForm.reset();
    setCurrentKb(null);
  };

  const handleEditKnowledgeBase = (kb: KnowledgeBase) => {
    setCurrentKb(kb);
    kbForm.setValue('name', kb.name);
    setIsCreating(false);
    setKbDialogOpen(true);
  };

  const handleCreateClick = () => {
    handleKbFormReset();
    setIsCreating(true);
    setKbDialogOpen(true);
  };

  const handleAddSourceClick = (type: 'url' | 'file' | 'text') => {
    setCurrentSourceType(type);
    setSourceDialogOpen(true);
  };

  const toggleWebPageSelection = (index: number) => {
    const updatedPages = [...webPages];
    updatedPages[index].selected = !updatedPages[index].selected;
    setWebPages(updatedPages);
  };

  const hasUrlSources = (kb: KnowledgeBase) => {
    return kb.sources.some(source => source.type === 'url');
  };

  const filteredKnowledgeBases = knowledgeBases.filter(kb =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get paginated data
  const paginatedKnowledgeBases = filteredKnowledgeBases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page when search query or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Knowledge Base
        </Button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search knowledge bases..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Sources</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedKnowledgeBases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <BookText className="h-8 w-8 text-muted-foreground" />
                        <p>No knowledge bases found</p>
                        <Button variant="outline" size="sm" onClick={handleCreateClick}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Knowledge Base
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedKnowledgeBases.map((kb) => (
                    <TableRow key={kb.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {kb.name}
                          {kb.auto_sync && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="ml-2">
                                    <RefreshCcw className="h-3 w-3 text-blue-500" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Auto-sync enabled</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{kb.source_count} sources</TableCell>
                      <TableCell>{new Date(kb.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {hasUrlSources(kb) && (
                            <Button variant="ghost" size="icon" onClick={() => handleResyncKnowledgeBase(kb)}>
                              <RefreshCw className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleEditKnowledgeBase(kb)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => {
                                  setKbToDelete(kb);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Knowledge Base</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{kbToDelete?.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={handleDeleteKnowledgeBase}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredKnowledgeBases.length > 0 && (
            <PaginationControls
              totalItems={filteredKnowledgeBases.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50]}
            />
          )}
        </>
      )}

      {/* Knowledge Base Dialog (Add/Edit) */}
      <Dialog 
        open={kbDialogOpen} 
        onOpenChange={(open) => {
          setKbDialogOpen(open);
          if (!open) handleKbFormReset();
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Add Knowledge Base' : 'Edit Knowledge Base'}</DialogTitle>
            <DialogDescription>
              {isCreating 
                ? 'Create a new knowledge base for your AI agents to use during calls.' 
                : 'Update your knowledge base information and sources.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...kbForm}>
            <form onSubmit={kbForm.handleSubmit(handleCreateKnowledgeBase)} className="space-y-4">
              <FormField
                control={kbForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Knowledge Base Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!isCreating && currentKb && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Sources</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-1 h-3 w-3" /> Add
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddSourceClick('url')}>
                          <Globe className="mr-2 h-4 w-4" />
                          Add Web Pages
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddSourceClick('file')}>
                          <File className="mr-2 h-4 w-4" />
                          Upload Files
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddSourceClick('text')}>
                          <FileText className="mr-2 h-4 w-4" />
                          Add Text
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    {currentKb.sources.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No sources added yet. Click "Add" to add your first source.
                      </div>
                    ) : (
                      currentKb.sources.map((source) => (
                        <div key={source.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            {source.type === 'url' && (
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">{source.title}</span>
                                {source.auto_sync && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="ml-2">
                                          <RefreshCcw className="h-3 w-3 text-blue-500" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Auto-sync enabled</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            )}
                            {source.type === 'file' && <div className="flex items-center">
                              <File className="h-4 w-4 mr-2 text-amber-500" />
                              <span className="text-sm">{source.title}</span>
                            </div>}
                            {source.type === 'text' && <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-green-500" />
                              <span className="text-sm">{source.title}</span>
                            </div>}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSourceToDelete(source);
                              setDeleteSourceDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {currentKb.sources.some(source => source.type === 'url') && (
                    <div className="flex items-center space-x-2 mt-4">
                      <Switch
                        id="kb-auto-sync"
                        checked={currentKb.auto_sync || false}
                        onCheckedChange={(checked) => {
                          const updatedKb = {...currentKb, auto_sync: checked};
                          setCurrentKb(updatedKb);
                          setKnowledgeBases(knowledgeBases.map(kb => 
                            kb.id === currentKb.id ? updatedKb : kb
                          ));
                        }}
                      />
                      <Label htmlFor="kb-auto-sync" className="text-sm cursor-pointer">
                        Auto sync web pages every 24 hours
                      </Label>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setKbDialogOpen(false);
                    handleKbFormReset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!kbForm.formState.isDirty && isCreating}
                >
                  {isCreating ? 'Create' : 'Update'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Source Confirmation Dialog */}
      <AlertDialog open={deleteSourceDialogOpen} onOpenChange={setDeleteSourceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Source</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{sourceToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteSource}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Source Dialog - File */}
      {currentSourceType === 'file' && (
        <Dialog 
          open={sourceDialogOpen} 
          onOpenChange={(open) => {
            setSourceDialogOpen(open);
            if (!open) setSelectedFile(null);
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>
                Upload documents to add to your knowledge base.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Select File</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center gap-2">
                      <File className="h-5 w-5 text-blue-500" />
                      <span>{selectedFile.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <File className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop a file here, or click to select
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('file')?.click()}
                      >
                        Select File
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOCX, TXT, CSV (max 20MB)
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setSourceDialogOpen(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleAddSource}
                disabled={!selectedFile}
              >
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Source Dialog - Text */}
      {currentSourceType === 'text' && (
        <Dialog 
          open={sourceDialogOpen} 
          onOpenChange={(open) => {
            setSourceDialogOpen(open);
            if (!open) {
              setSourceFileName('');
              setSourceContent('');
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Text</DialogTitle>
              <DialogDescription>
                Add custom text content to your knowledge base.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  id="fileName"
                  placeholder="e.g., Product FAQ"
                  value={sourceFileName}
                  onChange={(e) => setSourceFileName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Text Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your text content here..."
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                  rows={10}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setSourceDialogOpen(false);
                  setSourceFileName('');
                  setSourceContent('');
                }}
              >
                Cancel
              </Button>
              <Button
