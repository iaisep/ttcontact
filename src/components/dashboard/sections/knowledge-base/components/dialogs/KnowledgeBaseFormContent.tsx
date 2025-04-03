
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
  knowledgeBase: KnowledgeBase | null;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onSave: (data: { name: string }) => Promise<void>;
}

const KnowledgeBaseFormContent: React.FC<KnowledgeBaseFormContentProps> = ({
  knowledgeBase,
  onOpenChange,
  isSaving,
  onSave,
}) => {
  const form = useForm({
    defaultValues: {
      name: knowledgeBase?.name || '',
    }
  });

  React.useEffect(() => {
    if (knowledgeBase) {
      form.setValue('name', knowledgeBase.name);
    } else {
      form.setValue('name', '');
    }
  }, [knowledgeBase, form]);

  const handleReset = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
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
        
        {/* Footer will be rendered by the parent component */}
      </form>
    </Form>
  );
};

export default KnowledgeBaseFormContent;
