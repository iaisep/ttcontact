
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
  url?: string;
  parameters?: FunctionParameter;
  timeout_ms?: number;
  speak_during_execution?: boolean;
  speak_after_execution?: boolean;
  execution_message?: string;
}

export interface FunctionsContextProps {
  functions: AgentFunction[];
  addFunction: (newFunction: AgentFunction) => void;
  updateFunction: (index: number, updatedFunction: AgentFunction) => void;
  deleteFunction: (index: number) => void;
  getFunctionByName: (name: string) => AgentFunction | undefined;
}
