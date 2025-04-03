
import { AgentFunction } from '../functions/types';

export interface BaseFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  functionData: AgentFunction | null;
}

export interface AddFunctionModalProps extends BaseFunctionModalProps {
  onAdd: (newFunction: AgentFunction) => void;
}

export interface EditFunctionModalProps extends BaseFunctionModalProps {
  onUpdate: (updatedFunction: AgentFunction) => void;
}

export interface DeleteFunctionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  functionName: string;
}

export interface FunctionFormData {
  name: string;
  description: string;
  url: string;
  timeoutMs: string;
  parameters: string;
  speakDuring: boolean;
  speakAfter: boolean;
  type: string;
  executionMessage?: string;
}

export interface FunctionFormErrors {
  name?: string;
  description?: string;
  url?: string;
  parameters?: string;
}

export interface FunctionFormProps {
  formData: FunctionFormData;
  errors: FunctionFormErrors;
  onChange: (field: keyof FunctionFormData, value: any) => void;
  isCustomFunction: boolean;
}
