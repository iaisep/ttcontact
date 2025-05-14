
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAgentDetails } from '@/components/dashboard/sections/agents/hooks/useAgentDetails';
import AgentDetailLoading from '@/components/dashboard/sections/agents/detail/AgentDetailLoading';
import AgentDetailError from '@/components/dashboard/sections/agents/detail/AgentDetailError';
import AgentDetailContent from '@/components/dashboard/sections/agents/detail/AgentDetailContent';

const AgentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Use our optimized hook to fetch all agent details
  const { 
    agent, 
    llm, 
    voice, 
    knowledgeBases, 
    isLoading, 
    error,
    refreshData,
    updateAgentField
  } = useAgentDetails(slug);

  // Debug logs
  useEffect(() => {
    console.log('Agent Detail Page - knowledgeBases:', knowledgeBases);
  }, [knowledgeBases]);

  if (isLoading) {
    return <AgentDetailLoading />;
  }

  if (error || !agent) {
    return <AgentDetailError error={error} />;
  }

  return (
    <AgentDetailContent 
      agent={agent}
      llm={llm}
      voice={voice}
      knowledgeBases={knowledgeBases}
      updateAgentField={updateAgentField}
      refreshData={refreshData}
    />
  );
};

export default AgentDetailPage;
