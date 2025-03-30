import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ProfileTab from './account/ProfileTab';
import WorkspaceTab from './account/WorkspaceTab';
import TeamMembersTab from './account/TeamMembersTab';
import { User, Workspace } from './account/types';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/dashboard/LanguageSelector';

const AccountInfoSection = () => {
  const { fetchWithAuth } = useApiContext();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    setLoading(false);
  }, []);

  const fetchAccountInfo = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWorkspace(mockWorkspace);
      setCurrentUser(mockWorkspace.members[0]);
    } catch (error) {
      console.error('Failed to fetch account info:', error);
      toast.error(t('Failed to load account information'));
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold">{t('account_information')}</h1>
        <LanguageSelector />
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t('my_profile')}</TabsTrigger>
          <TabsTrigger value="workspace">{t('workspace')}</TabsTrigger>
          <TabsTrigger value="team">{t('team_members')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileTab currentUser={currentUser} />
        </TabsContent>
        
        <TabsContent value="workspace" className="space-y-4">
          <WorkspaceTab workspace={workspace} />
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <TeamMembersTab workspace={workspace} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountInfoSection;
