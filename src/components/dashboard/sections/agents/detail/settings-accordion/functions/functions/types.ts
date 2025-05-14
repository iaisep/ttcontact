
export interface FunctionParameter {
  type: string;
  description: string;
  properties?: Record<string, any>;
  required?: string[];
}

export interface AgentFunction {
  id?: string;
  name: string;
  description: string;
  type: string;
  url?: string;
  parameters?: FunctionParameter;
  timeout_ms?: number;
  speak_during_execution?: boolean;
  speak_after_execution?: boolean;
  execution_message?: string;
  transfer_destination?: {
    type: string;
    number?: string;
    routing_prompt?: string;
  };
  show_transferee_as_caller?: boolean;
  handoff_message?: {
    type: string;
    content: string;
  };
  // Calendar function properties
  event_type_id?: number;
  cal_api_key?: string;
  timezone?: string;
  // IVR digit press properties
  digit?: string;
  pause_detection_delay_ms?: number;
  // Transfer call property
  number?: string;
}

export interface FunctionsContextProps {
  functions: AgentFunction[];
  addFunction: (newFunction: AgentFunction) => void;
  updateFunction: (index: number, updatedFunction: AgentFunction) => void;
  deleteFunction: (index: number) => void;
  getFunctionByName: (name: string) => AgentFunction | undefined;
}

// Add the missing interfaces
export interface FunctionItemProps {
  func: AgentFunction;
  onEdit: (func: AgentFunction) => void;
  onDelete: (func: AgentFunction) => void;
}

export interface FunctionsSectionProps {
  agent: any; // Using 'any' for now, should be replaced with the proper type
  updateAgentField?: (fieldName: string, value: any) => void;
}
