
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Updated schema to include id_crm field as a number
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  tags: z.array(z.string()).default([]),
  id_crm: z.string().optional()
    .transform(val => val === '' ? null : Number(val))
    .refine(val => val === null || !isNaN(Number(val)), { message: 'ID CRM must be a number' })
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Update the interface to match how the data will be passed to the parent component
interface ContactFormProps {
  onSubmit: (values: { 
    name: string; 
    email?: string; 
    phone?: string; 
    tags: string[]; 
    id_crm: number | null;
  }) => void;
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
    tags?: string[];
    id_crm?: number | null;
  };
  isSubmitting?: boolean;
}

// Sample tags that will be available for selection
const availableTags = [
  "Llamadas_IRG",
  "llm_retell",
  "Marketing",
  "marketing-automation",
  "mcp",
  "mkt"
];

export const ContactForm = ({ onSubmit, initialValues, isSubmitting }: ContactFormProps) => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [tagsOpen, setTagsOpen] = useState(false);
  
  // Ensure we initialize tags as an empty array if it's undefined
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      tags: initialValues?.tags || [],
      id_crm: initialValues?.id_crm !== undefined ? String(initialValues.id_crm) : '',
    },
  });

  const handleSubmit = (values: ContactFormValues) => {    
    onSubmit({
      name: values.name,
      email: values.email,
      phone: values.phone,
      tags: values.tags || [], // Ensure we always pass an array
      id_crm: values.id_crm,
    });
  };

  // Get current tags from form with null safety
  const selectedTags = form.watch('tags') || [];

  // Filter available tags based on input value
  const filteredTags = availableTags.filter(
    tag => tag.toLowerCase().includes((inputValue || '').toLowerCase())
  );

  // Handle tag selection
  const toggleTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    form.setValue('tags', updatedTags, { shouldValidate: true });
  };

  // Handle tag input change
  const handleTagInputChange = (value: string) => {
    setInputValue(value || '');
  };

  // Handle adding a custom tag on Enter key
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue && !availableTags.includes(inputValue)) {
      e.preventDefault();
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, inputValue], { shouldValidate: true });
      setInputValue('');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Nombre del contacto')}</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Email')}</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Teléfono')}</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="id_crm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID CRM</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>{t('Etiquetas')}</FormLabel>
              <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
                <PopoverTrigger asChild>
                  <div className="flex flex-wrap gap-1 p-2 border rounded-md min-h-[38px] cursor-pointer">
                    {selectedTags.length > 0 ? (
                      selectedTags.map(tag => (
                        <div key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                          {tag}
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTag(tag);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">Select or type tags...</span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[260px] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search or add tag..." 
                      value={inputValue}
                      onValueChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                    />
                    <CommandEmpty>
                      {inputValue ? `Press Enter to add "${inputValue}"` : "No tags found"}
                    </CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                      {filteredTags.map(tag => (
                        <CommandItem 
                          key={tag}
                          onSelect={() => toggleTag(tag)}
                          className="flex items-center justify-between"
                        >
                          <span>{tag}</span>
                          {selectedTags.includes(tag) && <Check className="h-4 w-4 text-green-600" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <div className="p-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full text-orange-500 hover:text-orange-700"
                        onClick={(e) => {
                          e.preventDefault();
                          setTagsOpen(false);
                        }}
                        type="button"
                      >
                        Manage tags
                      </Button>
                    </div>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <><span className="animate-spin mr-2">◌</span> {t('Loading...')}</>
          ) : initialValues?.name ? t('save') : t('add_contact')}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
