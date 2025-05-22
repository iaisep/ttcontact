
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

  // Do not compare a contact with itself
  const filteredExistingContacts = existingContacts.filter(contact => 
    contact.id !== newContact.id
  );

  if (filteredExistingContacts.length === 0) {
    return { isDuplicate: false, score: 0 };
  }

  // Create a FuzzySet with all existing contacts
  const fuzzySet = FuzzySet();
  
  // Map of contact strings to actual contacts
  const contactsMap = new Map<string, Contact>();
  
  // Add each contact to the fuzzy set
  filteredExistingContacts.forEach(contact => {
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
    
    // Increase threshold to require higher match quality
    // Only consider as duplicate if score is above 90%
    if (scorePercentage > 90) {
      const matchedContact = contactsMap.get(matchedString);
      
      // Additional verification to prevent false positives
      // Compare name and email separately for more accuracy
      if (matchedContact) {
        const nameMatch = newContact.name.toLowerCase() === matchedContact.name.toLowerCase();
        const emailMatch = newContact.email?.toLowerCase() === matchedContact.email?.toLowerCase();
        
        // Only consider as duplicate if either name or email match
        if (nameMatch || (emailMatch && newContact.email && matchedContact.email)) {
          return { 
            isDuplicate: true, 
            score: scorePercentage,
            matchedContact: matchedContact
          };
        }
      }
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
): (Contact & { isDuplicate: boolean; duplicateScore?: number })[] => {
  return contacts.map(contact => {
    const { isDuplicate, score } = checkDuplicateContact(contact, existingContacts);
    return {
      ...contact,
      isDuplicate,
      duplicateScore: isDuplicate ? score : undefined,
      validation_percent: score
    };
  });
};
