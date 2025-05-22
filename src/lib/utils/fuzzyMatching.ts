
import FuzzySet from 'fuzzyset.js';
import { Contact } from '@/components/crm/ContactsTable';

// Function to generate a string representation of contact for fuzzy matching
const getContactString = (contact: Contact): string => {
  return `${contact.name || ''} ${contact.email || ''} ${contact.phone || ''}`.toLowerCase();
};

/**
 * Checks if a contact might be a duplicate of any existing contact
 * @param newContact Contact to check
 * @param existingContacts List of existing contacts to compare against
 * @returns Object with isDuplicate flag and score percentage
 */
export const checkDuplicateContact = (
  newContact: Contact,
  existingContacts: Contact[]
): { isDuplicate: boolean; score: number; matchedContact?: Contact } => {
  if (!existingContacts || existingContacts.length === 0) {
    return { isDuplicate: false, score: 0 };
  }

  // Create a FuzzySet with all existing contacts
  const fuzzySet = FuzzySet();
  
  // Map of contact strings to actual contacts
  const contactsMap = new Map<string, Contact>();
  
  // Add each contact to the fuzzy set
  existingContacts.forEach(contact => {
    const contactString = getContactString(contact);
    fuzzySet.add(contactString);
    contactsMap.set(contactString, contact);
  });
  
  // Check the new contact against the fuzzy set
  const newContactString = getContactString(newContact);
  const matches = fuzzySet.get(newContactString);
  
  if (matches && matches.length > 0) {
    const [score, matchedString] = matches[0];
    const scorePercentage = score * 100;
    
    if (scorePercentage > 98) {
      return { 
        isDuplicate: true, 
        score: scorePercentage,
        matchedContact: contactsMap.get(matchedString)
      };
    }
  }
  
  return { isDuplicate: false, score: 0 };
};

/**
 * Checks an array of contacts against existing contacts for duplicates
 * @param contacts Array of contacts to check
 * @param existingContacts Existing contacts to check against
 * @returns Array of contacts with isDuplicate flag
 */
export const checkDuplicatesInBatch = (
  contacts: Contact[],
  existingContacts: Contact[]
): (Contact & { isDuplicate: boolean })[] => {
  return contacts.map(contact => {
    const { isDuplicate } = checkDuplicateContact(contact, existingContacts);
    return {
      ...contact,
      isDuplicate
    };
  });
};
