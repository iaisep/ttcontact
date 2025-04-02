
import { RetellAgent } from '../../types/retell-types';

export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface AccordionSectionProps {
  agent: RetellAgent;
  updateAgentField: (fieldName: string, value: any) => void;
}

export interface AgentSettingsAccordionProps {
  agent: RetellAgent;
  knowledgeBases?: KnowledgeBase[];
  updateAgentField: (fieldName: string, value: any) => void;
}
