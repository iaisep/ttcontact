
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit } from "lucide-react";
import { Workspace, useWorkspace } from '@/hooks/useWorkspace';
import { useAuth } from '@/hooks/useAuth';
import WorkspaceLogo from './WorkspaceLogo';

interface WorkspaceInformationProps {
  workspace: Workspace | null;
}

const WorkspaceInformation = ({ workspace }: WorkspaceInformationProps) => {
  const { user } = useAuth();
  const { updateWorkspace } = useWorkspace(user?.id);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: workspace?.name || '',
    description: workspace?.description || '',
  });

  // Actualizar formData cuando workspace cambie
  useState(() => {
    if (workspace) {
      setFormData({
        name: workspace.name,
        description: workspace.description || '',
      });
    }
  });

  const handleSave = async () => {
    console.log('Saving workspace with data:', formData);
    const success = await updateWorkspace(formData);
    if (success) {
      setEditing(false);
    }
  };

  const handleCancel = () => {
    if (workspace) {
      setFormData({
        name: workspace.name,
        description: workspace.description || '',
      });
    }
    setEditing(false);
  };

  if (!workspace) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <p className="text-muted-foreground">No workspace data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Workspace Information</CardTitle>
          <CardDescription>
            Manage your workspace details and settings
          </CardDescription>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <WorkspaceLogo logoUrl={workspace.logo_url} name={workspace.name} />
          
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              {editing ? (
                <Input
                  id="workspace-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter workspace name"
                />
              ) : (
                <p className="text-lg font-medium">{workspace.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workspace-description">Description</Label>
              {editing ? (
                <Textarea
                  id="workspace-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter workspace description"
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground">
                  {workspace.description || 'No description provided'}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <p className="text-lg font-medium">{workspace.plan}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Created</Label>
                <p className="text-lg font-medium">
                  {new Date(workspace.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Parallel Calls Usage</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{
                      width: `${Math.min(100, (workspace.parallel_calls_used / workspace.parallel_calls_limit) * 100)}%`
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {workspace.parallel_calls_used} / {workspace.parallel_calls_limit}
                </span>
              </div>
            </div>
            
            {editing && (
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceInformation;
