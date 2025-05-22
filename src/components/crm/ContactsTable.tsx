
import React, { useState } from 'react';
import { TableWithPagination } from '@/components/ui/table-with-pagination';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Import, Search, User, Mail, Phone, Tag, Calendar, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getContacts, createContact, deleteContact } from '@/lib/api/contacts';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  last_activity: string | null;
  id_crm: number | null;
}

export const ContactsTable = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['contacts', searchTerm],
    queryFn: () => getContacts(searchTerm),
  });

  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      toast.success(t('Contact created successfully'));
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      console.error('Error creating contact:', error);
      toast.error(t('Failed to create contact'));
    }
  });

  const deleteContactMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      toast.success(t('Contact deleted successfully'));
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast.error(t('Failed to delete contact'));
    }
  });

  if (error) {
    toast.error('Failed to load contacts');
  }

  const columns = [
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddContact = () => {
    // Example contact data con id_crm como número entero
    const newContact = {
      name: 'New Contact',
      email: 'example@email.com',
      phone: '123-456-7890',
      tags: ['new', 'lead'],
      last_activity: new Date().toISOString(),
      id_crm: 12345, // Cambiado de string a número entero
    };
    
    createContactMutation.mutate(newContact);
  };

  const handleImport = () => {
    toast.info('Import contacts functionality will be implemented');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('contacts')}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImport} className="flex gap-1 items-center">
            <Import className="h-4 w-4" />
            <span>{t('importar')}</span>
          </Button>
          <Button onClick={handleAddContact} className="flex gap-1 items-center">
            <Plus className="h-4 w-4" />
            <span>{t('add_contact')}</span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            className="pl-9"
            placeholder={t('search')}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button variant="outline">{t('filter')}</Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <TableWithPagination 
          data={contacts}
          columns={columns}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          emptyState={
            <div className="text-center py-10 text-gray-500">
              {searchTerm ? t('No hay resultados.') : t('No hay contactos.')}
            </div>
          }
        />
      )}
    </div>
  );
};

export default ContactsTable;
