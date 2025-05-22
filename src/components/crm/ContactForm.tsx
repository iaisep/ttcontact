
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/context/LanguageContext';

// Updated schema to validate id_crm properly
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  tags: z.string().optional(),
  id_crm: z.string().optional()
    .transform(val => val === '' || val === undefined ? null : Number(val))
    .refine(val => val === null || !isNaN(val as number), { message: 'ID CRM must be a number' })
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Update the interface to match how the data will be passed to the parent component
interface ContactFormProps {
  onSubmit: (values: { 
    name: string; 
    email?: string; 
    phone?: string; 
    tags: string[]; 
    id_crm: number | null; // Ensure this is a number or null
  }) => void;
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
    tags?: string;
    id_crm?: number | null;
  };
  isSubmitting?: boolean;
}

export const ContactForm = ({ onSubmit, initialValues, isSubmitting }: ContactFormProps) => {
  const { t } = useLanguage();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      tags: initialValues?.tags || '',
      id_crm: initialValues?.id_crm !== undefined ? String(initialValues.id_crm) : '',
    },
  });

  const handleSubmit = (values: ContactFormValues) => {
    // Convert tags from comma-separated string to array and ensure name is always provided
    const formattedValues = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      id_crm: values.id_crm as number | null, // This is now correctly typed thanks to the schema transform
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
