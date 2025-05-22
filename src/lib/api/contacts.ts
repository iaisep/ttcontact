
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
    
    // Ensure all contacts have tags array
    const processedData = data?.map(contact => ({
      ...contact,
      tags: Array.isArray(contact.tags) ? contact.tags : []
    })) || [];
    
    return processedData;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

export async function createContact(contactData: Omit<Contact, 'id'>) {
  try {
    // Ensure tags is always an array
    const safeContactData = {
      ...contactData,
      tags: Array.isArray(contactData.tags) ? contactData.tags : []
    };
    
    // Note: user_id will be automatically set by the trigger we created
    const { data, error } = await supabase.from('contacts').insert([safeContactData]).select();
    
    if (error) throw error;
    
    return data?.[0];
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}

export async function updateContact(id: string, contactData: Partial<Omit<Contact, 'id'>>) {
  try {
    // If tags is present, ensure it's an array
    const safeContactData = {
      ...contactData,
      ...(contactData.tags && { tags: Array.isArray(contactData.tags) ? contactData.tags : [] })
    };
    
    const { data, error } = await supabase
      .from('contacts')
      .update(safeContactData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
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
