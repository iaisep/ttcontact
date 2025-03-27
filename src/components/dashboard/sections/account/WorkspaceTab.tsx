
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

interface WorkspaceTabProps {
  workspace: Workspace | null;
}

const WorkspaceTab = ({ workspace }: WorkspaceTabProps) => {
  const [editingWorkspace, setEditingWorkspace] = useState(false);
  const [workspaceFormData, setWorkspaceFormData] = useState({
    name: workspace?.name || '',
    description: workspace?.description || '',
  });

  const updateWorkspace = async () => {
    try {
      // Logic would be implemented here for actual API calls
      toast.success('Workspace updated successfully');
      setEditingWorkspace(false);
    } catch (error) {
      console.error('Failed to update workspace:', error);
      toast.error('Failed to update workspace');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Information</CardTitle>
          <CardDescription>
            Manage your workspace settings
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
                Upload Logo
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                {editingWorkspace ? (
                  <Input
                    id="workspace-name"
                    value={workspaceFormData.name}
                    onChange={(e) => setWorkspaceFormData({ ...workspaceFormData, name: e.target.value })}
                    placeholder="Your workspace name"
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-lg">{workspace?.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => setEditingWorkspace(true)}>
                      Edit
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workspace-description">Description</Label>
                {editingWorkspace ? (
                  <Textarea
                    id="workspace-description"
                    value={workspaceFormData.description}
                    onChange={(e) => setWorkspaceFormData({ ...workspaceFormData, description: e.target.value })}
                    placeholder="Describe your workspace"
                    rows={3}
                  />
                ) : (
                  <p className="text-lg">{workspace?.description || 'No description provided'}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Plan</Label>
                <div className="flex justify-between">
                  <p className="text-lg">{workspace?.plan}</p>
                  <Button variant="outline" size="sm">
                    Upgrade
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Parallel Calls</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
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
                <Label>Created</Label>
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
                    Cancel
                  </Button>
                  <Button onClick={updateWorkspace}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Manage advanced workspace settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Workspace ID</Label>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-2 py-1 rounded text-sm">{workspace?.id}</code>
              <Button variant="ghost" size="icon" onClick={() => {
                if (workspace) {
                  navigator.clipboard.writeText(workspace.id);
                  toast.success('Workspace ID copied to clipboard');
                }
              }}>
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Permanently delete this workspace and all associated data.
            </p>
            <Button variant="destructive">Delete Workspace</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceTab;
