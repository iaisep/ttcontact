
import React, { useState } from 'react';
import { TableWithPagination } from '@/components/ui/table-with-pagination';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getContacts, createContact, deleteContact } from '@/lib/api/contacts';
import ContactHeader from './ContactHeader';
import ContactSearchBar from './ContactSearchBar';
import { useContactTableColumns } from './ContactTableColumns';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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
  const columns = useContactTableColumns();
  
  // Query and mutation hooks
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

  // Handle errors
  if (error) {
    toast.error('Failed to load contacts');
  }

  // Event handlers
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
      id_crm: 12345,
    };
    
    createContactMutation.mutate(newContact);
  };

  const handleImport = () => {
    toast.info('Import contacts functionality will be implemented');
  };

  // Empty state component
  const emptyState = (
    <div className="text-center py-10 text-gray-500">
      {searchTerm ? t('No hay resultados.') : t('No hay contactos.')}
    </div>
  );

  return (
    <div className="space-y-4">
      <ContactHeader 
        onAddContact={handleAddContact} 
        onImport={handleImport} 
      />
      
      <ContactSearchBar 
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <TableWithPagination 
          data={contacts}
          columns={columns}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          emptyState={emptyState}
        />
      )}
    </div>
  );
};

export default ContactsTable;
