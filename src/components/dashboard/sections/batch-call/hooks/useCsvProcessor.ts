
import { useState, useEffect } from 'react';

export interface ContactData {
  phone: string;
  name?: string;
  variables?: Record<string, string>;
}

export function useCsvProcessor() {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  
  const processCsvContent = (content: string): ContactData[] => {
    const lines = content.trim().split('\n');
    if (lines.length === 0) return [];
    
    // Extract header and convert to lowercase for consistent matching
    const headers = lines[0].split(',').map(header => header.toLowerCase().trim());
    
    const phoneIndex = headers.findIndex(h => h.includes('phone'));
    if (phoneIndex === -1) {
      console.error('CSV must include a "phone" column');
      return [];
    }
    
    const processedContacts: ContactData[] = [];
    
    // Process each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',');
      
      // Ensure we have a phone number
      const phoneNumber = values[phoneIndex]?.trim();
      if (!phoneNumber) continue;
      
      const contact: ContactData = { phone: phoneNumber };
      
      // Extract dynamic variables if present
      const variables: Record<string, string> = {};
      headers.forEach((header, index) => {
        if (index !== phoneIndex && header && values[index]) {
          if (!header.includes('phone')) {
            variables[header] = values[index].trim();
          }
        }
      });
      
      if (Object.keys(variables).length > 0) {
        contact.variables = variables;
      }
      
      processedContacts.push(contact);
    }
    
    return processedContacts;
  };
  
  const saveContactsToLocalStorage = (contacts: ContactData[], fileKey?: string) => {
    const storageKey = fileKey || 'batch_call_contacts';
    localStorage.setItem(storageKey, JSON.stringify(contacts));
  };
  
  const loadContactsFromLocalStorage = (fileKey?: string): ContactData[] => {
    const storageKey = fileKey || 'batch_call_contacts';
    const storedContacts = localStorage.getItem(storageKey);
    if (!storedContacts) return [];
    
    try {
      return JSON.parse(storedContacts);
    } catch (error) {
      console.error('Failed to parse stored contacts:', error);
      return [];
    }
  };
  
  const processFile = (file: File): Promise<ContactData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const processedContacts = processCsvContent(content);
        setContacts(processedContacts);
        saveContactsToLocalStorage(processedContacts, file.name);
        resolve(processedContacts);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };
  
  return {
    contacts,
    setContacts,
    processFile,
    processCsvContent,
    saveContactsToLocalStorage,
    loadContactsFromLocalStorage
  };
}
