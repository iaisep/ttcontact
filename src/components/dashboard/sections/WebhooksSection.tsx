
import { useState, useEffect } from 'react';
import { Webhook } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useApiContext } from '@/context/ApiContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';

interface WebhookFormValues {
  webhookUrl: string;
}

interface WebhookData {
  url: string;
  events: string[];
}

const WebhooksSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentWebhook, setCurrentWebhook] = useState<WebhookData | null>(null);
  const { fetchWithAuth } = useApiContext();
  
  const form = useForm<WebhookFormValues>({
    defaultValues: {
      webhookUrl: ''
    }
  });

  // Load existing webhook data on component mount
  useEffect(() => {
    // Try to load existing webhook data if available
    const storedWebhook = localStorage.getItem('retell_webhook');
    if (storedWebhook) {
      try {
        const webhookData = JSON.parse(storedWebhook);
        setCurrentWebhook(webhookData);
        form.setValue('webhookUrl', webhookData.url);
      } catch (error) {
        console.error('Error parsing stored webhook data:', error);
      }
    }
  }, [form]);

  const onSubmit = async (data: WebhookFormValues) => {
    if (!data.webhookUrl) {
      toast.error('Please enter a webhook URL');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        webhook: {
          url: data.webhookUrl,
          events: ["call_started", "call_ended"]
        }
      };

      console.log('Sending webhook payload:', payload);

      const response = await fetchWithAuth('/add-or-update-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Webhook API response:', response);

      // Update local state with the new webhook data
      const webhookData = {
        url: data.webhookUrl,
        events: ["call_started", "call_ended"]
      };

      setCurrentWebhook(webhookData);
      
      // Persist to localStorage for UI state
      localStorage.setItem('retell_webhook', JSON.stringify(webhookData));

      toast.success('Webhook updated successfully');
    } catch (error) {
      console.error('Error updating webhook:', error);
      toast.error('Failed to update webhook settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Webhook className="h-5 w-5" />
        <h1 className="text-xl font-medium">Webhooks</h1>
      </div>
      
      <div className="border rounded-lg p-6 bg-background">
        <p className="text-sm text-muted-foreground mb-6">
          Configure your webhook URL to receive real-time event notifications.
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/help-center" className="text-primary cursor-pointer ml-1">(Learn more)</Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80">
                  Webhooks allow your application to receive real-time notifications about events 
                  that happen in your account. You can use webhooks to integrate with your systems 
                  and automate workflows.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>

        {/* Show current webhook info if exists */}
        {currentWebhook && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Current Webhook Configuration:</h3>
            <p className="text-sm text-muted-foreground mb-1">
              <strong>URL:</strong> {currentWebhook.url}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Events:</strong> {currentWebhook.events.join(', ')}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter webhook URL" 
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="text-sm text-muted-foreground">
              <p><strong>Events configured:</strong> call_started, call_ended</p>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default WebhooksSection;
