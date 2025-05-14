
import { RetellAgent } from '../components/types/retell-types';

export interface AccordionSectionProps {
  agent: RetellAgent;
  updateAgentField: (field: string, value: any) => void;
}
