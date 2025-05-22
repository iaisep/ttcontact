
import { supabase } from '../supabase';
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
    const { data, error } = await supabase.from('contacts').insert([contactData]).select();
    
    if (error) throw error;
    
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
