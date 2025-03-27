import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, UserCircle, Building, Users, Upload, Save, CloudUpload, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  plan: string;
  parallel_calls_limit: number;
  parallel_calls_used: number;
  created_at: string;
  members: User[];
}

const AccountInfoSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
  });
  const [workspaceFormData, setWorkspaceFormData] = useState({
    name: '',
    description: '',
  });
  const [editingUser, setEditingUser] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const mockWorkspace: Workspace = {
    id: 'ws_1',
    name: 'My Organization',
    description: 'AI voice agents for customer service and sales',
    logo_url: '/placeholder.svg',
    owner_id: 'user_1',
    plan: 'Pro',
    parallel_calls_limit: 20,
    parallel_calls_used: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    members: [
      {
        id: 'user_1',
        name: 'John Smith',
        email: 'john@example.com',
        avatar_url: undefined,
        role: 'admin',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      },
      {
        id: 'user_2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        avatar_url: undefined,
        role: 'member',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      },
      {
        id: 'user_3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        avatar_url: undefined,
        role: 'member',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      },
    ],
  };

  useEffect(() => {
    setWorkspace(mockWorkspace);
    setCurrentUser(mockWorkspace.members[0]);
    
    setUserFormData({
      name: mockWorkspace.members[0].name,
      email: mockWorkspace.members[0].email,
    });
    
    setWorkspaceFormData({
      name: mockWorkspace.name,
      description: mockWorkspace.description || '',
    });
    
    setLoading(false);
  }, []);

  const fetchAccountInfo = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWorkspace(mockWorkspace);
      setCurrentUser(mockWorkspace.members[0]);
      
      setUserFormData({
        name: mockWorkspace.members[0].name,
        email: mockWorkspace.members[0].email,
      });
      
      setWorkspaceFormData({
        name: mockWorkspace.name,
        description: mockWorkspace.description || '',
      });
    } catch (error) {
      console.error('Failed to fetch account info:', error);
      toast.error('Failed to load account information');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (currentUser && workspace) {
        const updatedUser = { ...currentUser, ...userFormData };
        setCurrentUser(updatedUser);
        
        const updatedMembers = workspace.members.map(member => 
          member.id === currentUser.id ? updatedUser : member
        );
        setWorkspace({ ...workspace, members: updatedMembers });
      }
      
      setEditingUser(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const updateWorkspace = async () => {
    try {
      if (workspace) {
        setWorkspace({ 
          ...workspace, 
          name: workspaceFormData.name,
          description: workspaceFormData.description,
        });
      }
      
      setEditingWorkspace(false);
      toast.success('Workspace updated successfully');
    } catch (error) {
      console.error('Failed to update workspace:', error);
      toast.error('Failed to update workspace');
    }
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteDialogOpen(false);
    } catch (error) {
      console.error('Failed to send invite:', error);
      toast.error('Failed to send invitation');
    }
  };

  const removeMember = async (userId: string) => {
    try {
      if (workspace) {
        const updatedMembers = workspace.members.filter(member => member.id !== userId);
        setWorkspace({ ...workspace, members: updatedMembers });
      }
      
      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    }
  };

  const changeMemberRole = async (userId: string, newRole: string) => {
    try {
      if (workspace) {
        const updatedMembers = workspace.members.map(member => 
          member.id === userId ? { ...member, role: newRole } : member
        );
        setWorkspace({ ...workspace, members: updatedMembers });
      }
      
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Account Information</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={currentUser?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {currentUser?.name ? getInitials(currentUser.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    {editingUser ? (
                      <Input
                        id="name"
                        value={userFormData.name}
                        onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <p className="text-lg">{currentUser?.name}</p>
                        <Button variant="ghost" size="sm" onClick={() => setEditingUser(true)}>
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {editingUser ? (
                      <Input
                        id="email"
                        type="email"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        placeholder="Your email address"
                      />
                    ) : (
                      <p className="text-lg">{currentUser?.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <p className="text-lg capitalize">{currentUser?.role}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <p className="text-lg">
                      {currentUser?.created_at 
                        ? new Date(currentUser.created_at).toLocaleDateString() 
                        : '-'}
                    </p>
                  </div>
                  
                  {editingUser && (
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => {
                        setEditingUser(false);
                        setUserFormData({
                          name: currentUser?.name || '',
                          email: currentUser?.email || '',
                        });
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={updateUserProfile}>
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
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">••••••••••••</p>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Not enabled</p>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workspace" className="space-y-4">
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
                    <Copy className="h-4 w-4" />
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
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Invite a new team member to your workspace.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="invite-role">Role</Label>
              <select
                id="invite-role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
              <p className="text-sm text-muted-foreground">
                Members can view and edit resources. Admins can manage team members and billing.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendInvite}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Copy = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export default AccountInfoSection;
