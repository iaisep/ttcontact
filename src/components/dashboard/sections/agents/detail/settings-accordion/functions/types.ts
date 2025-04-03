
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

export interface FunctionParameter {
  type: string;
  description: string;
  properties?: Record<string, any>;
  required?: string[];
}

export interface AgentFunction {
  name: string;
  description: string;
  type: string;
  timeout_ms?: number;
  speak_during_execution?: boolean;
  speak_after_execution?: boolean;
  parameters?: FunctionParameter;
  url?: string;
}

export interface FunctionsSectionProps {
  agent: RetellAgent;
}

export interface FunctionItemProps {
  func: AgentFunction;
  onEdit: (func: AgentFunction) => void;
  onDelete: (func: AgentFunction) => void;
}

export interface FunctionTemplateType {
  name: string;
  type: string;
  icon: JSX.Element;
  description: string;
}
