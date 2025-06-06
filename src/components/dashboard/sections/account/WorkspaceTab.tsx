
import { Workspace } from '@/hooks/useWorkspace';
import WorkspaceInformation from './workspace/WorkspaceInformation';
import WorkspaceAdvancedSettings from './workspace/WorkspaceAdvancedSettings';

interface WorkspaceTabProps {
  workspace: Workspace | null;
}

const WorkspaceTab = ({ workspace }: WorkspaceTabProps) => {
  return (
    <div className="space-y-4">
      <WorkspaceInformation workspace={workspace} />
      <WorkspaceAdvancedSettings workspace={workspace} />
    </div>
  );
};

export default WorkspaceTab;
