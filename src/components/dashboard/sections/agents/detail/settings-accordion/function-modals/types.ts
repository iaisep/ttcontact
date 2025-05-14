
import { AgentFunction } from '../functions/types';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

export interface AddFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newFunction: AgentFunction) => void;
  functionData: AgentFunction | null;
  agent?: RetellAgent; // Add agent prop to receive the agent object
}

export interface EditFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFunction: AgentFunction) => void;
  functionData: AgentFunction | null;
}

export interface DeleteFunctionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  functionName: string;
}

export interface FunctionFormProps {
  formData: {
    name: string;
    description: string;
    url?: string;
    timeoutMs?: string;
    parameters?: string;
    speakDuring?: boolean;
    speakAfter?: boolean;
    executionMessage?: string;
    digit?: string;
  };
  errors: FunctionFormErrors;
  onChange: (field: string, value: any) => void;
  isCustomFunction: boolean;
}

export interface FunctionFormErrors {
  name?: string;
  description?: string;
  url?: string;
  parameters?: string;
  digit?: string;
  [key: string]: string | undefined; // Add index signature to allow for dynamic keys
}
