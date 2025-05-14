
import { RetellAgent } from '../../types/retell-types';

export interface AccordionSectionProps {
  agent: RetellAgent;
  updateAgentField: (field: string, value: any) => void;
}

export interface KnowledgeBaseSectionProps extends AccordionSectionProps {
  knowledgeBases?: any[];
}

export interface AgentSettingsAccordionProps {
  agent: RetellAgent;
  knowledgeBases?: any[];
  updateAgentField: (field: string, value: any) => void;
}
