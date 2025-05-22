
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { AlertTriangle, FileWarning, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Table as UITable, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { importContactsFromCSV } from '@/lib/api/contacts';
import { getContacts } from '@/lib/api/contacts';
import { checkDuplicateContact } from '@/lib/utils/fuzzyMatching';
import { Contact } from '@/components/crm/ContactsTable';
import { Badge } from '@/components/ui/badge';

interface ImportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: () => void;
}

interface ParsedData {
  validData: Array<Partial<Contact>>;
  invalidData?: Array<{row: any, reason: string}>;
  potentialDuplicates?: Array<{row: Partial<Contact>, matchedContact: Contact, score: number}>;
}

const ImportContactsDialog: React.FC<ImportContactsDialogProps> = ({ open, onOpenChange, onImportComplete }) => {
  const { t } = useLanguage();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData>({ validData: [] });
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCsvFile(file);
    if (file) {
      parseCSV(file);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const validData: Array<Partial<Contact>> = [];
        const invalidData: Array<{row: any, reason: string}> = [];

        results.data.forEach((row: any) => {
          if (!row.name) {
            invalidData.push({ row, reason: t('Name is required') });
          } else {
            validData.push({
              name: row.name,
              email: row.email || '',
              phone: row.phone || '',
              tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
              last_activity: null,
              id_crm: row.id_crm ? parseInt(row.id_crm, 10) : null,
            });
          }
        });

        const potentialDuplicates = await checkForDuplicates(validData);

        setParsedData({ validData, invalidData, potentialDuplicates });
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast.error(t('Failed to parse CSV file'));
      }
    });
  };

  const handleImport = async () => {
    if (isImporting) return;

    setIsImporting(true);
    try {
      const { validData } = parsedData;
      if (validData.length > 0) {
        await importContactsFromCSV(validData as Omit<Contact, 'id'>[]);
        toast.success(t('Contacts imported successfully'));
        onImportComplete?.();
      } else {
        // Change warn to a supported method
        toast.error(t('No valid contacts to import'));
      }
    } catch (error: any) {
      console.error("Error importing contacts:", error);
      if (error.message) {
        toast.error(t(error.message));
      } else {
        toast.error(t('Failed to import contacts'));
      }
    } finally {
      setIsImporting(false);
    }
  };

  // Function to check for potential duplicates in the CSV data
  const checkForDuplicates = async (parsedData: Partial<Contact>[]) => {
    try {
      const existingContacts = await getContacts();
      
      // Check each parsed row against existing contacts for duplicates
      const potentialDuplicates = parsedData
        .map(row => {
          const contactToCheck = {
            id: 'temp-id', // Temporary ID for checking
            name: row.name || '',
            email: row.email,
            phone: row.phone,
            tags: row.tags || [],
            last_activity: null,
            id_crm: row.id_crm
          };
          
          const { isDuplicate, score, matchedContact } = checkDuplicateContact(
            contactToCheck as Contact,
            existingContacts
          );
          
          if (isDuplicate && matchedContact) {
            return {
              row,
              matchedContact,
              score
            };
          }
          
          return null;
        })
        .filter(Boolean) as Array<{row: Partial<Contact>, matchedContact: Contact, score: number}>;
      
      return potentialDuplicates;
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Import Contacts')}</DialogTitle>
          <DialogDescription>{t('Upload a CSV file to import contacts.')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <input
            type="file"
            id="upload-csv"
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
          />
          <Button variant="outline" asChild>
            <label htmlFor="upload-csv" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>{t('Select CSV File')}</span>
            </label>
          </Button>
          {csvFile && (
            <div className="text-sm text-gray-500">
              {t('Selected file')}: {csvFile.name}
            </div>
          )}

          {parsedData.invalidData && parsedData.invalidData.length > 0 && (
            <div className="rounded-md border p-4 bg-amber-50 text-amber-700">
              <div className="flex items-center gap-2">
                <FileWarning className="h-4 w-4" />
                <span>{t('Some rows have errors and will not be imported.')}</span>
              </div>
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">{t('Row Data')}</TableHead>
                    <TableHead>{t('Reason')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.invalidData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{JSON.stringify(item.row)}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
            </div>
          )}

          {parsedData.potentialDuplicates && parsedData.potentialDuplicates.length > 0 && (
            <div className="rounded-md border p-4 bg-orange-50 text-orange-700">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{t('Some rows might be duplicates.')}</span>
              </div>
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('Row Data')}</TableHead>
                    <TableHead>{t('Matched Contact')}</TableHead>
                    <TableHead>{t('Score')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.potentialDuplicates.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{JSON.stringify(item.row)}</TableCell>
                      <TableCell>{item.matchedContact.name} <Badge variant="outline">Duplicate ({item.score.toFixed(1)}%)</Badge></TableCell>
                      <TableCell>{item.score.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
            </div>
          )}
        </div>

        <Button onClick={handleImport} disabled={isImporting}>
          {isImporting ? t('Importing...') : t('Import')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsDialog;
