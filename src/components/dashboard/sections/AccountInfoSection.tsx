
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import ProfileTab from './account/ProfileTab';
import WorkspaceTab from './account/WorkspaceTab';
import TeamMembersTab from './account/TeamMembersTab';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useWorkspace } from '@/hooks/useWorkspace';

const AccountInfoSection = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const { workspace, loading: workspaceLoading } = useWorkspace(user?.id);

  const loading = profileLoading || workspaceLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-muted-foreground">Please log in to view account information.</p>
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
          <ProfileTab currentUser={profile} />
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
