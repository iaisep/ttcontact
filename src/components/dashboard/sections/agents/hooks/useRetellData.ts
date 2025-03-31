
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { Agent } from '../types';
import { RetellAgent, RetellVoice, RetellFolder, RetellLLM, RetellPhoneNumber } from '../types/retell-types';

export const useRetellData = () => {
  const { apiKey, baseURL, fetchWithAuth } = useApiContext();
  const { t } = useLanguage();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [voices, setVoices] = useState<RetellVoice[]>([]);
  const [folders, setFolders] = useState<RetellFolder[]>([]);
  const [llms, setLLMs] = useState<RetellLLM[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<RetellPhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRetellData = async () => {
    setIsLoading(true);
    try {
      const endpoints = [
        '/list-agents',
        '/list-voices',
        '/get-folders',
        '/list-retell-llms',
        '/list-phone-numbers',
        '/check-org-complaince-status',
      ];

      const results = await Promise.all(
        endpoints.map(endpoint => fetchWithAuth(endpoint))
      );

      // Process results according to the order of endpoints
      const [agentsData, voicesData, foldersData, llmsData, phoneNumbersData] = results;

      // Store voice data for later use
      if (voicesData?.voices) {
        setVoices(voicesData.voices);
      }

      if (foldersData?.folders) {
        setFolders(foldersData.folders);
      }

      if (llmsData?.llms) {
        setLLMs(llmsData.llms);
      }

      if (phoneNumbersData?.phone_numbers) {
        setPhoneNumbers(phoneNumbersData.phone_numbers);
      }

      // Transform agent data with additional info from other endpoints
      if (Array.isArray(agentsData)) {
        const transformedAgents: Agent[] = agentsData.map((agent: RetellAgent) => {
          // Find the voice information
          const voiceInfo = voicesData?.voices?.find((v: RetellVoice) => 
            v.id === agent.voice_id
          );

          // Find phone number assigned to this agent
          const phoneNumber = phoneNumbersData?.phone_numbers?.find((p: RetellPhoneNumber) => 
            p.inbound_agent_id === agent.agent_id || p.outbound_agent_id === agent.agent_id
          );

          return {
            id: agent.agent_id || agent.id,
            name: agent.agent_name || agent.name,
            description: agent.description || '',
            agent_type: agent.response_engine?.type || agent.agent_type || '',
            voice_id: agent.voice_id,
            folder: agent.folder || '',
            // Add new properties
            voice: voiceInfo ? {
              name: voiceInfo.name,
              avatar_url: voiceInfo.avatar_url
            } : undefined,
            phone: phoneNumber?.phone_number,
            last_modification_timestamp: agent.last_modification_timestamp,
          };
        });

        setAgents(transformedAgents);
      }

    } catch (error) {
      console.error('Error fetching Retell data:', error);
      toast.error(t('error_loading_agents'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRetellData();
  }, [apiKey, baseURL]);

  return {
    agents,
    voices,
    folders,
    llms,
    phoneNumbers,
    isLoading,
    setAgents,
    setIsLoading,
    fetchRetellData
  };
};
