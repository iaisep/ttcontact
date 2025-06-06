
// Export all help center content categories
import { introduction } from './introduction';
import { agents } from './agents';
import { phoneNumbers } from './phoneNumbers';
import { knowledgeBase } from './knowledgeBase';
import { api } from './api';
import { security } from './security';
import { faq } from './faq';
import { callHistory } from './callHistory';
import { apiKeys } from './apiKeys';
import { settings } from './settings';
import { guides } from './guides';
import { technicalDocumentation } from './technicalDocumentation';
import { systemArchitecture } from './systemArchitecture';
import { integrations } from './integrations';

// Combine all categories into a single object
export const helpCenterContent: Record<string, any[]> = {
  'introduction': introduction,
  'technical-documentation': technicalDocumentation,
  'system-architecture': systemArchitecture,
  'agents': agents,
  'phone-numbers': phoneNumbers,
  'call-history': callHistory,
  'integrations': integrations,
  'knowledge-base': knowledgeBase,
  'api': api,
  'api-keys': apiKeys,
  'security': security,
  'settings': settings,
  'guides': guides,
  'faq': faq
};
