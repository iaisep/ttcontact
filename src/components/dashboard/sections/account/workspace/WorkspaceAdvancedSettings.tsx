
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { Workspace } from '../types';
import { CopyIcon } from '../CopyIcon';
import { useLanguage } from '@/context/LanguageContext';

interface WorkspaceAdvancedSettingsProps {
  workspace: Workspace | null;
}

const WorkspaceAdvancedSettings = ({ workspace }: WorkspaceAdvancedSettingsProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('advanced_settings')}</CardTitle>
        <CardDescription>
          {t('manage_advanced_settings')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('workspace_id')}</Label>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-2 py-1 rounded text-sm">{workspace?.id}</code>
            <Button variant="ghost" size="icon" onClick={() => {
              if (workspace) {
                navigator.clipboard.writeText(workspace.id);
                toast.success(t('workspace_id_copied'));
              }
            }}>
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium text-destructive">{t('danger_zone')}</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {t('delete_workspace_warning')}
          </p>
          <Button variant="destructive">{t('delete_workspace')}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceAdvancedSettings;
