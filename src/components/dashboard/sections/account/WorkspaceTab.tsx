
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, CloudUpload, Save } from "lucide-react";
import { toast } from 'sonner';
import { Workspace } from './types';
import { CopyIcon } from './CopyIcon';
import { useLanguage } from '@/context/LanguageContext';

interface WorkspaceTabProps {
  workspace: Workspace | null;
}

const WorkspaceTab = ({ workspace }: WorkspaceTabProps) => {
  const { t } = useLanguage();
  const [editingWorkspace, setEditingWorkspace] = useState(false);
  const [workspaceFormData, setWorkspaceFormData] = useState({
    name: workspace?.name || '',
    description: workspace?.description || '',
  });

  const updateWorkspace = async () => {
    try {
      // Logic would be implemented here for actual API calls
      toast.success(t('Workspace updated successfully'));
      setEditingWorkspace(false);
    } catch (error) {
      console.error('Failed to update workspace:', error);
      toast.error(t('Failed to update workspace'));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('workspace_information')}</CardTitle>
          <CardDescription>
            {t('manage_workspace')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-32 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                {workspace?.logo_url ? (
                  <img 
                    src={workspace.logo_url} 
                    alt={workspace.name} 
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
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">{t('workspace_name')}</Label>
                {editingWorkspace ? (
                  <Input
                    id="workspace-name"
                    value={workspaceFormData.name}
                    onChange={(e) => setWorkspaceFormData({ ...workspaceFormData, name: e.target.value })}
                    placeholder={t('your_workspace_name')}
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-lg">{workspace?.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => setEditingWorkspace(true)}>
                      {t('edit')}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workspace-description">{t('description')}</Label>
                {editingWorkspace ? (
                  <Textarea
                    id="workspace-description"
                    value={workspaceFormData.description}
                    onChange={(e) => setWorkspaceFormData({ ...workspaceFormData, description: e.target.value })}
                    placeholder={t('describe_workspace')}
                    rows={3}
                  />
                ) : (
                  <p className="text-lg">{workspace?.description || t('no_description')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>{t('plan')}</Label>
                <div className="flex justify-between">
                  <p className="text-lg">{workspace?.plan}</p>
                  <Button variant="outline" size="sm">
                    {t('upgrade')}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{t('parallel_calls')}</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('usage')}</span>
                    <span>
                      {workspace?.parallel_calls_used} / {workspace?.parallel_calls_limit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ 
                        width: `${
                          workspace 
                            ? (workspace.parallel_calls_used / workspace.parallel_calls_limit) * 100 
                            : 0
                        }%` 
                      }} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{t('created')}</Label>
                <p className="text-lg">
                  {workspace?.created_at 
                    ? new Date(workspace.created_at).toLocaleDateString() 
                    : '-'}
                </p>
              </div>
              
              {editingWorkspace && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setEditingWorkspace(false);
                    setWorkspaceFormData({
                      name: workspace?.name || '',
                      description: workspace?.description || '',
                    });
                  }}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={updateWorkspace}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('save')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
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
    </div>
  );
};

export default WorkspaceTab;
