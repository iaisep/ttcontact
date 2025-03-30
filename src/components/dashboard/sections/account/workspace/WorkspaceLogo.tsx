
import { Building, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';

interface WorkspaceLogoProps {
  logoUrl?: string;
  name?: string;
}

const WorkspaceLogo = ({ logoUrl, name }: WorkspaceLogoProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-32 w-32 rounded-md bg-muted flex items-center justify-center overflow-hidden">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={name || 'Workspace logo'} 
            className="h-full w-full object-cover"
          />
        ) : (
          <Building className="h-16 w-16 text-muted-foreground" />
        )}
      </div>
      <Button variant="outline" size="sm">
        <CloudUpload className="h-4 w-4 mr-2" />
        {t('upload_logo')}
      </Button>
    </div>
  );
};

export default WorkspaceLogo;
