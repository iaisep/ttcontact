
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

// Combine all categories into a single object
export const helpCenterContent: Record<string, any[]> = {
  'introduction': introduction,
  'agents': agents,
  'phone-numbers': phoneNumbers,
  'knowledge-base': knowledgeBase,
  'api': api,
  'security': security,
  'faq': faq,
  'call-history': callHistory,
  'api-keys': apiKeys,
  'settings': settings,
  'guides': guides
};
