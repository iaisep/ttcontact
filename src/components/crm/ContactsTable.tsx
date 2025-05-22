import React, { useState, useEffect } from 'react';
import { TableWithPagination } from '@/components/ui/table-with-pagination';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Import, Search, User, Mail, Phone, Tag, Calendar, AlertTriangle, Trash2, Check, Square, CheckSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getContacts, createContact, deleteContact, deleteMultipleContacts } from '@/lib/api/contacts';
import ContactDialog from './ContactDialog';
import ImportContactsDialog from './ImportContactsDialog';
import { checkDuplicatesInBatch, checkDuplicateContact } from '@/lib/utils/fuzzyMatching';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tags: string[];
  last_activity: string | null;
  id_crm: number | null;
  isDuplicate?: boolean;
  duplicateScore?: number;
  validation_percent?: number;
}

export const ContactsTable = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [contactsWithDuplicates, setContactsWithDuplicates] = useState<Contact[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['contacts', searchTerm],
    queryFn: () => getContacts(searchTerm),
  });

  // Update contacts with duplicate flags whenever the contacts list changes
  useEffect(() => {
    if (contacts.length > 0) {
      // Each contact should only be checked against other contacts, not itself
      const withDuplicates = contacts.map(contact => {
        // Filter out the current contact from the comparison list
        const otherContacts = contacts.filter(c => c.id !== contact.id);
        const { isDuplicate, score } = checkDuplicateContact(contact, otherContacts);
        
        return {
          ...contact,
          isDuplicate,
          duplicateScore: isDuplicate ? score : undefined
        };
      });
      
      setContactsWithDuplicates(withDuplicates);
    } else {
      setContactsWithDuplicates([]);
    }
  }, [contacts]);

  // Reset selected contacts when contacts list changes
  useEffect(() => {
    setSelectedContactIds([]);
  }, [contacts]);

  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      toast.success(t('Contact created successfully'));
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('Error creating contact:', error);
      
      // Check for duplicate CRM ID error and show translated toast message
      if (error.message) {
        toast.error(t(error.message));
      } else {
        toast.error(t('Failed to create contact'));
      }
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

  const deleteMultipleContactsMutation = useMutation({
    mutationFn: deleteMultipleContacts,
    onSuccess: (result) => {
      toast.success(t('Selected contacts deleted successfully'));
      setSelectedContactIds([]);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      console.error('Error deleting multiple contacts:', error);
      toast.error(t('Failed to delete selected contacts'));
    }
  });

  if (error) {
    toast.error('Failed to load contacts');
  }

  const toggleSelectAll = () => {
    if (selectedContactIds.length === contactsWithDuplicates.length) {
      // Deselect all
      setSelectedContactIds([]);
    } else {
      // Select all
      setSelectedContactIds(contactsWithDuplicates.map(contact => contact.id));
    }
  };

  const toggleSelectContact = (id: string) => {
    setSelectedContactIds(prev => 
      prev.includes(id) 
        ? prev.filter(contactId => contactId !== id) 
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedContactIds.length === 0) return;
    
    if (window.confirm(t(`Are you sure you want to delete ${selectedContactIds.length} contact(s)?`))) {
      deleteMultipleContactsMutation.mutate(selectedContactIds);
    }
  };

  const columns = [
    {
      key: 'select',
      header: (
        <div className="flex items-center justify-center">
          <Checkbox 
            checked={selectedContactIds.length > 0 && selectedContactIds.length === contactsWithDuplicates.length}
            onCheckedChange={toggleSelectAll}
            aria-label={t('Select all contacts')}
          />
        </div>
      ),
      cell: (contact: Contact) => (
        <div className="flex items-center justify-center">
          <Checkbox 
            checked={selectedContactIds.includes(contact.id)}
            onCheckedChange={() => toggleSelectContact(contact.id)}
            aria-label={t('Select contact')}
          />
        </div>
      ),
      className: "w-12",
    },
    {
      key: 'name',
      header: (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{t('Nombre del contacto')}</span>
        </div>
      ),
      cell: (contact: Contact) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{contact.name}</span>
          {contact.isDuplicate && (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {t('duplicado')} 
              {contact.duplicateScore !== undefined && (
                <span className="ml-1 text-xs">
                  ({contact.duplicateScore.toFixed(1)}%)
                </span>
              )}
            </Badge>
          )}
        </div>
      ),
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
      key: 'id_crm',
      header: (
        <div className="flex items-center gap-2">
          <span>ID CRM</span>
        </div>
      ),
      cell: (contact: Contact) => <span>{contact.id_crm !== null ? contact.id_crm : '—'}</span>,
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
        <div className="flex gap-1 flex-wrap">
          {contact.tags?.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          )) || '—'}
        </div>
      ),
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
    setIsDialogOpen(true);
  };

  const handleContactSubmit = (contactData: Omit<Contact, 'id' | 'last_activity'>) => {
    const newContact = {
      ...contactData,
      last_activity: new Date().toISOString(),
    };
    
    createContactMutation.mutate(newContact);
  };

  const handleImport = () => {
    setIsImportDialogOpen(true);
  };

  const handleImportComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
    setIsImportDialogOpen(false);
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
        
        {selectedContactIds.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={handleDeleteSelected}
            className="flex gap-1 items-center"
            disabled={deleteMultipleContactsMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
            {t('Delete Selected')} ({selectedContactIds.length})
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <TableWithPagination 
          data={contactsWithDuplicates}
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

      <ContactDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleContactSubmit}
        isSubmitting={createContactMutation.isPending}
        mode="create"
      />

      <ImportContactsDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

export default ContactsTable;
