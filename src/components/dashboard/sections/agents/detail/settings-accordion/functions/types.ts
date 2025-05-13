
export interface FunctionParameter {
  type: string;
  description: string;
  properties?: Record<string, any>;
  required?: string[];
}

export interface AgentFunction {
  id?: string; // Adding optional id property to fix the TypeScript errors
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
  // Add missing properties for calendar functions
  event_type_id?: number;
  cal_api_key?: string;
  timezone?: string;
  // Add missing property for IVR digit press
  digit?: string;
  // Add missing property for pause detection delay
  pause_detection_delay_ms?: number;
  // Add missing property for transfer call
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
