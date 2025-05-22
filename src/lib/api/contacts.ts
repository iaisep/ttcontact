
import { supabase } from '@/integrations/supabase/client';
import { Contact } from '@/components/crm/ContactsTable';

export async function getContacts(searchTerm: string = '') {
  try {
    let query = supabase.from('contacts').select('*');
    
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

export async function createContact(contactData: Omit<Contact, 'id'>) {
  try {
    // Ensure id_crm is properly typed
    const formattedData = {
      ...contactData,
      id_crm: contactData.id_crm === undefined ? null : contactData.id_crm
    };

    const { data, error } = await supabase.from('contacts').insert([formattedData]).select();
    
    if (error) {
      // Convert database error message to a more user-friendly format
      if (error.message && error.message.includes('unique_id_crm') || 
          error.message && error.message.includes('CRM ID')) {
        throw new Error('El ID CRM ya está en uso. Por favor utilice un identificador único.');
      }
      throw error;
    }
    
    return data?.[0];
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}

export async function updateContact(id: string, contactData: Partial<Omit<Contact, 'id'>>) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update(contactData)
      .eq('id', id)
      .select();
    
    if (error) {
      // Handle specific error for duplicate CRM ID
      if (error.message && error.message.includes('unique_id_crm') || 
          error.message && error.message.includes('CRM ID')) {
        throw new Error('El ID CRM ya está en uso. Por favor utilice un identificador único.');
      }
      throw error;
    }
    
    return data?.[0];
  } catch (error) {
    console.error(`Error updating contact with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteContact(id: string) {
  try {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    throw error;
  }
}

export async function importContactsFromCSV(contacts: Omit<Contact, 'id'>[]) {
  try {
    if (contacts.length === 0) return { count: 0 };
    
    // Format contacts to ensure proper types
    const formattedContacts = contacts.map(contact => ({
      ...contact,
      id_crm: contact.id_crm === undefined ? null : contact.id_crm,
      last_activity: new Date().toISOString()
    }));
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(formattedContacts)
      .select();
    
    if (error) {
      // Check if error is related to duplicate CRM ID
      if (error.message && (error.message.includes('unique_id_crm') || error.message.includes('CRM ID'))) {
        throw new Error('Uno o más contactos tienen IDs CRM que ya están en uso. Por favor, verifique sus datos e intente nuevamente.');
      }
      throw error;
    }
    
    return { count: data?.length || 0, data };
  } catch (error) {
    console.error('Error importing contacts:', error);
    throw error;
  }
}
