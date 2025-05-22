
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { Upload, FileDown, AlertCircle, CheckCircle } from 'lucide-react';
import { parseCSV, generateContactTemplate, createContactsFromImport } from '@/lib/utils/fileImport';
import { toast } from 'sonner';

interface ImportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

const ImportContactsDialog = ({ open, onOpenChange, onImportComplete }: ImportContactsDialogProps) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState<{
    valid: number;
    invalid: number;
    success: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImportStats(null);
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
    if (!file) {
      toast.error(t('Please select a file to import'));
      return;
    }

    setIsProcessing(true);
    try {
      const { validData, invalidData } = await parseCSV(file);
      
      // Show summary of validation
      if (invalidData.length > 0) {
        toast.warning(`${invalidData.length} rows have validation errors. Check the details.`);
      }
      
      // Import valid contacts
      const successCount = await createContactsFromImport(validData);
      
      setImportStats({
        valid: validData.length,
        invalid: invalidData.length,
        success: successCount
      });
      
      if (successCount > 0) {
        toast.success(`${successCount} contacts imported successfully`);
        onImportComplete();
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(t('Error processing file'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Import Contacts')}</DialogTitle>
          <DialogDescription>
            {t('Upload a CSV file with contacts information')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
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
              <p className="text-sm font-medium mb-1">
                {file ? file.name : t('Click to upload or drag and drop')}
              </p>
              <p className="text-xs text-muted-foreground">
                CSV {t('or')} Excel (max 1000 {t('contacts')})
              </p>
            </label>
          </div>

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
                <li>{t('Valid contacts')}: {importStats.valid}</li>
                <li>{t('Invalid contacts')}: {importStats.invalid}</li>
                <li>{t('Successfully imported')}: {importStats.success}</li>
              </ul>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file || isProcessing}
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
