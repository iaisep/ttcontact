import Papa from 'papaparse';
import { toast } from 'sonner';
import { Contact } from '@/components/crm/ContactsTable';
import { createContact } from '@/lib/api/contacts';

export interface ContactImport {
  name: string;
  email: string;
  phone: string;
  id_crm: string;
  tags?: string;
}

export const validateContactImport = (data: ContactImport): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone is required');
  }
  
  if (!data.id_crm || isNaN(Number(data.id_crm))) {
    errors.push('Valid ID CRM is required (must be a number)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const parseCSV = async (file: File): Promise<{
  data: ContactImport[];
  validData: ContactImport[];
  invalidData: { row: ContactImport; errors: string[] }[];
}> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as ContactImport[];
        const validatedData = parsedData.map(row => ({
          row,
          validation: validateContactImport(row)
        }));
        
        const validData = validatedData
          .filter(item => item.validation.isValid)
          .map(item => item.row);
          
        const invalidData = validatedData
          .filter(item => !item.validation.isValid)
          .map(item => ({
            row: item.row,
            errors: item.validation.errors
          }));
        
        resolve({
          data: parsedData,
          validData,
          invalidData
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const createContactsFromImport = async (validData: ContactImport[]): Promise<number> => {
  let successCount = 0;
  
  for (const item of validData) {
    try {
      // Convert tags from string to string array if present
      const tags = item.tags ? item.tags.split(',').map(tag => tag.trim()) : [];
      
      await createContact({
        name: item.name,
        email: item.email,
        phone: item.phone,
        id_crm: Number(item.id_crm),
        tags,
        last_activity: new Date().toISOString() // Add the missing field
      });
      
      successCount++;
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  }
  
  return successCount;
};

export const generateContactTemplate = (): string => {
  const headers = ['name', 'email', 'phone', 'id_crm', 'tags'];
  const exampleRow = ['John Doe', 'john@example.com', '+1234567890', '12345', 'lead,important'];
  
  return Papa.unparse([
    headers,
    exampleRow
  ]);
};
