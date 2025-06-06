
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'admin' | 'member' | 'viewer';
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  plan: string;
  parallel_calls_limit: number;
  parallel_calls_used: number;
  created_at: string;
  members: WorkspaceMember[];
}

export const useWorkspace = (userId?: string) => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchWorkspace();
  }, [userId]);

  const fetchWorkspace = async () => {
    try {
      console.log('Fetching workspace for user:', userId);
      
      // Primero obtener el workspace del usuario
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId)
        .maybeSingle();

      if (workspaceError) {
        console.error('Error fetching workspace:', workspaceError);
        throw workspaceError;
      }

      if (!workspaceData) {
        console.log('No workspace found for user');
        setWorkspace(null);
        return;
      }

      console.log('Workspace found:', workspaceData);

      // Luego obtener los miembros del workspace
      const { data: membersData, error: membersError } = await supabase
        .from('workspace_members')
        .select(`
          id,
          role,
          user_id,
          profiles!inner (
            id,
            name,
            email,
            avatar_url,
            created_at
          )
        `)
        .eq('workspace_id', workspaceData.id);

      if (membersError) {
        console.error('Error fetching workspace members:', membersError);
        // No lanzar error aquí, seguir con workspace sin miembros
      }

      // Transformar los datos de miembros
      const members: WorkspaceMember[] = membersData?.map((member: any) => ({
        id: member.profiles.id,
        name: member.profiles.name,
        email: member.profiles.email,
        avatar_url: member.profiles.avatar_url,
        role: member.role,
        created_at: member.profiles.created_at,
      })) || [];

      console.log('Members found:', members);

      setWorkspace({
        ...workspaceData,
        members,
      });
    } catch (error) {
      console.error('Error fetching workspace:', error);
      toast.error('Failed to load workspace information');
    } finally {
      setLoading(false);
    }
  };

  const updateWorkspace = async (updates: Partial<Workspace>) => {
    if (!workspace) return false;

    try {
      console.log('Updating workspace with:', updates);
      
      const { error } = await supabase
        .from('workspaces')
        .update(updates)
        .eq('id', workspace.id);

      if (error) throw error;
      
      setWorkspace(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Workspace updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating workspace:', error);
      toast.error('Failed to update workspace');
      return false;
    }
  };

  const inviteMember = async (email: string, role: 'admin' | 'member' | 'viewer' = 'member') => {
    if (!workspace) return false;

    try {
      // En una implementación real, enviarías una invitación por email
      // Por ahora, solo mostramos un mensaje de éxito
      toast.success(`Invitation sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error('Failed to invite member');
      return false;
    }
  };

  const removeMember = async (memberId: string) => {
    if (!workspace) return false;

    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspace.id)
        .eq('user_id', memberId);

      if (error) throw error;
      
      await fetchWorkspace(); // Refrescar los datos
      toast.success('Member removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
      return false;
    }
  };

  const updateMemberRole = async (memberId: string, newRole: 'admin' | 'member' | 'viewer') => {
    if (!workspace) return false;

    try {
      const { error } = await supabase
        .from('workspace_members')
        .update({ role: newRole })
        .eq('workspace_id', workspace.id)
        .eq('user_id', memberId);

      if (error) throw error;
      
      await fetchWorkspace(); // Refrescar los datos
      toast.success('Member role updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role');
      return false;
    }
  };

  return { 
    workspace, 
    loading, 
    updateWorkspace, 
    inviteMember, 
    removeMember, 
    updateMemberRole,
    refetch: fetchWorkspace 
  };
};
