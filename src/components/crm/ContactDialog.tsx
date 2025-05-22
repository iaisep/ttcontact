
import React from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import ContactForm from './ContactForm';
import { Contact } from './ContactsTable';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<Contact, 'id' | 'last_activity'>) => void;
  initialValues?: Partial<Contact>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export const ContactDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  initialValues,
  isSubmitting,
  mode
}: ContactDialogProps) => {
  const { t } = useLanguage();

  const handleSubmit = (values: { 
    name: string; 
    email?: string; 
    phone?: string; 
    tags: string[];
    id_crm: number | null;
  }) => {
    onSubmit({
      name: values.name,
      email: values.email || '',
      phone: values.phone,
      tags: Array.isArray(values.tags) ? values.tags : [],
      id_crm: values.id_crm,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('add_contact') : t('edit')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? t('Complete the form to add a new contact')
              : t('Update contact information')
            }
          </DialogDescription>
        </DialogHeader>
        
        <ContactForm 
          onSubmit={handleSubmit} 
          initialValues={{
            ...initialValues,
            tags: Array.isArray(initialValues?.tags) ? initialValues.tags : []
          }} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
