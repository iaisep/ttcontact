
import React from 'react';
import { User, Mail, Phone, Tag, Calendar, Hash } from 'lucide-react';
import { Contact } from '@/components/crm/ContactsTable';
import { useLanguage } from '@/context/LanguageContext';

export const useContactTableColumns = () => {
  const { t } = useLanguage();

  return [
    {
      key: 'name',
      header: (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{t('Nombre del contacto')}</span>
        </div>
      ),
      cell: (contact: Contact) => <span className="font-medium">{contact.name}</span>,
    },
    {
      key: 'email',
      header: (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{t('Email')}</span>
        </div>
      ),
      cell: (contact: Contact) => <span>{contact.email}</span>,
    },
    {
      key: 'phone',
      header: (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>{t('Teléfono')}</span>
        </div>
      ),
      cell: (contact: Contact) => <span>{contact.phone}</span>,
    },
    {
      key: 'tags',
      header: (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <span>{t('Etiquetas')}</span>
        </div>
      ),
      cell: (contact: Contact) => (
        <div className="flex gap-1">
          {contact.tags?.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          )) || '—'}
        </div>
      ),
    },
    {
      key: 'id_crm',
      header: (
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          <span>{t('ID CRM')}</span>
        </div>
      ),
      cell: (contact: Contact) => <span>{contact.id_crm || '—'}</span>,
    },
    {
      key: 'last_activity',
      header: (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{t('Última actividad')}</span>
        </div>
      ),
      cell: (contact: Contact) => (
        <span>{contact.last_activity ? new Date(contact.last_activity).toLocaleDateString() : '—'}</span>
      ),
    },
  ];
};
