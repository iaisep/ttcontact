
import { PostCallAnalysisItem } from '@/components/dashboard/sections/agents/types/retell-types';

export interface FieldModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: PostCallAnalysisItem) => void;
  type: string;
  existingItem?: PostCallAnalysisItem;
}

export interface PostCallAnalysisProps {
  agent: any;
  updateAgentField: (field: string, value: any) => void;
}
