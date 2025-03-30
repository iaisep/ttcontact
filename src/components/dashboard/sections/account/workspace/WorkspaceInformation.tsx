
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workspace } from '../types';
import WorkspaceLogo from './WorkspaceLogo';
import WorkspaceDetails from './WorkspaceDetails';
import { useLanguage } from '@/context/LanguageContext';

interface WorkspaceInformationProps {
  workspace: Workspace | null;
}

const WorkspaceInformation = ({ workspace }: WorkspaceInformationProps) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('workspace_information')}</CardTitle>
        <CardDescription>
          {t('manage_workspace')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <WorkspaceLogo 
            logoUrl={workspace?.logo_url} 
            name={workspace?.name} 
          />
          <WorkspaceDetails workspace={workspace} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceInformation;
