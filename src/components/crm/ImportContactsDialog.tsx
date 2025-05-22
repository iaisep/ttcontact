import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { Upload, FileDown, AlertCircle, CheckCircle, Table } from 'lucide-react';
import { parseCSV, generateContactTemplate, createContactsFromImport, ContactImport } from '@/lib/utils/fileImport';
import { toast } from 'sonner';
import { Table as UITable, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { importContactsFromCSV } from '@/lib/api/contacts';

interface ImportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

const ImportContactsDialog = ({ open, onOpenChange, onImportComplete }: ImportContactsDialogProps) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parsedData, setParsedData] = useState<{
    data: ContactImport[];
    validData: ContactImport[];
    invalidData: { row: ContactImport; errors: string[] }[];
  } | null>(null);
  const [importStats, setImportStats] = useState<{
    valid: number;
    invalid: number;
    success: number;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      if (selectedFile.type !== 'text/csv' && 
          !selectedFile.name.endsWith('.csv') &&
          !selectedFile.type.includes('excel') &&
          !selectedFile.name.endsWith('.xlsx')) {
        toast.error(t('Only CSV and Excel files are supported'));
        return;
      }
      
      setFile(selectedFile);
      setIsParsingFile(true);
      setImportStats(null);
      
      try {
        // Parse the file to show preview
        const result = await parseCSV(selectedFile);
        setParsedData(result);
      } catch (error) {
        console.error('Error parsing file:', error);
        toast.error(t('Error processing file'));
        setParsedData(null);
      } finally {
        setIsParsingFile(false);
      }
    }
  };

  const handleDownloadTemplate = () => {
    const csvData = generateContactTemplate();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!parsedData || !parsedData.validData.length) {
      toast.error(t('No valid contacts to import'));
      return;
    }

    setIsProcessing(true);
    try {
      // Import valid contacts via bulk API call
      const { count: successCount } = await importContactsFromCSV(
        parsedData.validData.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          id_crm: Number(item.id_crm),
          tags: item.tags ? item.tags.split(',').map(tag => tag.trim()) : [],
          last_activity: new Date().toISOString()
        }))
      );
      
      setImportStats({
        valid: parsedData.validData.length,
        invalid: parsedData.invalidData.length,
        success: successCount
      });
      
      if (successCount > 0) {
        toast.success(`${successCount} contacts imported successfully`);
        onImportComplete();
      }
    } catch (error: any) {
      console.error('Error importing contacts:', error);
      
      // Display the error message from the API response
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t('Error processing file'));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const renderDataPreview = () => {
    if (!parsedData || parsedData.data.length === 0) return null;
    
    // Get all unique keys from the data
    const allKeys = Array.from(
      new Set(
        parsedData.data.flatMap(item => Object.keys(item))
      )
    );
    
    // Limit the number of rows to display
    const previewRows = parsedData.data.slice(0, 5);
    
    return (
      <div className="mt-4">
        <div className="flex items-center mb-2">
          <Table className="h-4 w-4 mr-2" />
          <h3 className="text-sm font-medium">
            {t('Data Preview')} ({Math.min(5, parsedData.data.length)} {t('of')} {parsedData.data.length} {t('rows')})
          </h3>
        </div>
        
        <div className="border rounded-md overflow-auto max-h-60">
          <UITable>
            <TableHeader>
              <TableRow>
                {allKeys.map(key => (
                  <TableHead key={key} className="text-xs py-2 px-3 bg-muted/50">
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row, index) => (
                <TableRow key={index} className="border-b last:border-b-0">
                  {allKeys.map(key => (
                    <TableCell key={`${index}-${key}`} className="text-xs py-2 px-3">
                      {row[key as keyof typeof row]?.toString() || '—'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </UITable>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{t('Valid contacts')}:</span>
            <span className="font-medium text-sm text-green-600">{parsedData.validData.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('Invalid contacts')}:</span>
            <span className={`font-medium text-sm ${parsedData.invalidData.length > 0 ? "text-amber-600" : ""}`}>
              {parsedData.invalidData.length}
            </span>
          </div>
          
          {parsedData.invalidData.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-3">
              <p className="text-sm text-amber-800 font-medium mb-2">{t('Validation Errors')}:</p>
              <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                {parsedData.invalidData.slice(0, 3).map((item, idx) => (
                  <li key={idx}>
                    Row {idx + 1}: {item.errors.join(', ')}
                  </li>
                ))}
                {parsedData.invalidData.length > 3 && (
                  <li>...and {parsedData.invalidData.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl p-5">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl">{t('Import Contacts')}</DialogTitle>
          <DialogDescription>
            {t('Upload a CSV file with contacts information')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5">
          <div>
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              {t('Download Template')}
            </Button>
          </div>
          
          <div className="border border-dashed rounded-lg p-6 text-center">
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              {file ? (
                <>
                  <p className="text-sm font-medium mb-1">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.name.endsWith('.csv') ? 'CSV' : 'Excel'} ({t('max')} 1000 {t('contacts')})
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium mb-1">{t('Click to upload or drag and drop')}</p>
                  <p className="text-xs text-muted-foreground">
                    CSV {t('or')} Excel ({t('max')} 1000 {t('contacts')})
                  </p>
                </>
              )}
            </label>
          </div>

          {isParsingFile && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Data Preview Section */}
          {parsedData && renderDataPreview()}

          {importStats && (
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                {importStats.success > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                )}
                <h3 className="font-medium">{t('Import Results')}</h3>
              </div>
              <ul className="text-sm space-y-1">
                <li className="flex justify-between">
                  <span>{t('Valid contacts')}:</span> 
                  <span>{importStats.valid}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('Invalid contacts')}:</span>
                  <span>{importStats.invalid}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('Successfully imported')}:</span>
                  <span>{importStats.success}</span>
                </li>
              </ul>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!parsedData || !parsedData.validData.length || isProcessing || isParsingFile}
              className="bg-primary"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">◌</span> {t('Processing...')}
                </>
              ) : (
                t('Import')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsDialog;
