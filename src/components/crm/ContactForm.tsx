
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  tags: string;
  id_crm: string; // Changed from number to string for form handling
}

interface ContactFormProps {
  onSubmit: (values: {
    name: string;
    email: string;
    phone: string;
    tags: string[];
    id_crm: number | null;
  }) => void;
  initialValues?: {
    name: string;
    email: string;
    phone: string;
    tags: string;
    id_crm?: number | null;
  };
  isSubmitting: boolean;
}

const ContactForm = ({ onSubmit, initialValues, isSubmitting }: ContactFormProps) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>({
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      tags: initialValues?.tags || '',
      id_crm: initialValues?.id_crm ? String(initialValues.id_crm) : '', // Convert number to string for the form
    }
  });

  const processSubmit = (data: ContactFormValues) => {
    // Parse tags string into array
    const tagsArray = data.tags
      ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : [];
    
    // Convert id_crm back to number or null for submission
    const idCrm = data.id_crm ? Number(data.id_crm) : null;
    
    onSubmit({
      name: data.name,
      email: data.email,
      phone: data.phone,
      tags: tagsArray,
      id_crm: idCrm
    });
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('Nombre del contacto')} *</Label>
        <Input
          id="name"
          {...register('name', { required: true })}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{t('Name is required')}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t('Email')}</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">{t('Teléfono')}</Label>
        <Input
          id="phone"
          {...register('phone')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="id_crm">ID CRM</Label>
        <Input
          id="id_crm"
          type="text"
          {...register('id_crm')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">{t('Etiquetas')} (comma-separated)</Label>
        <Input
          id="tags"
          {...register('tags')}
          placeholder="tag1, tag2, tag3"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('Loading...') : t('save')}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
