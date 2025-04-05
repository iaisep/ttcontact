
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { KnowledgeBase } from '../../types';

interface KnowledgeBaseFormContentProps {
  name: string;
  setName: (name: string) => void;
  currentKb: KnowledgeBase | null;
  handleAutoSyncChange: (checked: boolean) => void;
}

const KnowledgeBaseFormContent: React.FC<KnowledgeBaseFormContentProps> = ({
  name,
  setName,
  currentKb,
}) => {
  const form = useForm({
    defaultValues: {
      name: name || '',
    }
  });

  React.useEffect(() => {
    form.setValue('name', name || '');
  }, [name, form]);

  return (
    <Form {...form}>
      <form id="knowledge-base-form" className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Knowledge Base Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter a name" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    setName(e.target.value);
                  }}
                  value={name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Footer will be rendered by the parent component */}
      </form>
    </Form>
  );
};

export default KnowledgeBaseFormContent;
