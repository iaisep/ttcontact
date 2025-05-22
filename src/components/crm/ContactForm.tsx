
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/context/LanguageContext';

// Updated schema to properly handle id_crm as either a number or undefined
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  tags: z.string().optional(),
  id_crm: z.string().optional()
    .transform(val => {
      // If empty string or undefined, return undefined
      if (!val || val === '') return undefined;
      // Otherwise, try to parse as number
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    })
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Update the interface to match the schema
interface ContactFormProps {
  onSubmit: (values: { 
    name: string; 
    email?: string; 
    phone?: string; 
    tags: string[];
    id_crm?: number;
  }) => void;
  initialValues?: Partial<ContactFormValues>;
  isSubmitting?: boolean;
}

export const ContactForm = ({ onSubmit, initialValues, isSubmitting }: ContactFormProps) => {
  const { t } = useLanguage();
  
  // Use string values in the form for all fields including id_crm
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      // Handle tags correctly - check if it's an array first
      tags: Array.isArray(initialValues?.tags) 
        ? initialValues.tags.join(',') 
        : (initialValues?.tags as string || ''),
      // Convert number to string for the form input (needed since HTML inputs work with strings)
      id_crm: initialValues?.id_crm || '',
    },
  });

  const handleSubmit = (values: ContactFormValues) => {
    // Convert tags from comma-separated string to array
    const formattedValues = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      // id_crm will be transformed by zod schema to number or undefined
      id_crm: values.id_crm as unknown as number | undefined,
    };
    
    onSubmit(formattedValues);
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
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Etiquetas')}</FormLabel>
              <FormControl>
                <Input placeholder="lead, important, follow-up" {...field} />
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
              <FormLabel>{t('ID CRM')}</FormLabel>
              <FormControl>
                <Input placeholder="12345" type="text" {...field} />
              </FormControl>
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
