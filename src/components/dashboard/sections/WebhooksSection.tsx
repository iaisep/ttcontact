
import { useState } from 'react';
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
import { 
  useWebhooks,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './webhooks';

interface WebhookFormValues {
  webhookUrl: string;
}

const WebhooksSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { webhooks, createWebhook } = useWebhooks();
  
  const form = useForm<WebhookFormValues>({
    defaultValues: {
      webhookUrl: webhooks?.[0]?.url || ''
    }
  });

  const onSubmit = async (data: WebhookFormValues) => {
    if (!data.webhookUrl) {
      toast.error('Please enter a webhook URL');
      return;
    }

    setIsLoading(true);
    try {
      // Using the first webhook event from eventOptions for simplicity
      const success = await createWebhook(data.webhookUrl, ['call.started']);
      if (success) {
        toast.success('Webhook updated successfully');
      } else {
        toast.error('Failed to update webhook');
      }
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
                <span className="text-primary cursor-pointer ml-1">(Learn more)</span>
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
            
            <div className="flex justify-end mt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default WebhooksSection;
