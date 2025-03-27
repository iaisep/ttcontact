
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from 'sonner';
import { User, Workspace } from './types';
import { InviteMemberDialog } from './InviteMemberDialog';

interface TeamMembersTabProps {
  workspace: Workspace | null;
}

const TeamMembersTab = ({ workspace }: TeamMembersTabProps) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const removeMember = async (userId: string) => {
    try {
      // Logic would be implemented here for actual API calls
      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    }
  };

  const changeMemberRole = async (userId: string, newRole: string) => {
    try {
      // Logic would be implemented here for actual API calls
      toast.success('Member role updated successfully');
    } catch (error) {
      console.error('Failed to update member role:', error);
      toast.error('Failed to update member role');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage users who have access to this workspace
            </CardDescription>
          </div>
          <Button onClick={() => setInviteDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {workspace?.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-4">
                    <Label htmlFor={`role-${member.id}`} className="sr-only">Role</Label>
                    <select
                      id={`role-${member.id}`}
                      className="h-9 rounded-md border border-input bg-background px-3"
                      value={member.role}
                      onChange={(e) => changeMemberRole(member.id, e.target.value)}
                      disabled={member.id === workspace.owner_id}
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    
                    {member.id === workspace.owner_id && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Owner
                      </span>
                    )}
                  </div>
                  
                  {member.id !== workspace.owner_id && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${member.name} from the workspace?`)) {
                          removeMember(member.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <InviteMemberDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen} 
      />
    </>
  );
};

export default TeamMembersTab;
