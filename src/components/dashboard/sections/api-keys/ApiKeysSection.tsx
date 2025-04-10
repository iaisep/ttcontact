
import { useState } from 'react';
import { useApiKeys } from './hooks/useApiKeys';
import ApiKeyHeader from './components/ApiKeyHeader';
import ApiKeyList from './components/ApiKeyList';
import ApiKeyDialog from './components/ApiKeyDialog';

const ApiKeysSection = () => {
  const { 
    apiKeys, 
    loading, 
    revealedApiKeys, 
    toggleApiKeyVisibility, 
    createApiKey, 
    deleteApiKey 
  } = useApiKeys();
  
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  const handleCreateApiKey = async (name: string) => {
    const key = await createApiKey(name);
    return key;
  };

  return (
    <div className="space-y-6">
      <ApiKeyHeader onCreateClick={handleCreateClick} />
      
      <ApiKeyList 
        apiKeys={apiKeys}
        loading={loading}
        revealedApiKeys={revealedApiKeys}
        onToggleVisibility={toggleApiKeyVisibility}
        onDelete={deleteApiKey}
        onCreateClick={handleCreateClick}
      />

      <ApiKeyDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateApiKey={handleCreateApiKey}
      />
    </div>
  );
};

export default ApiKeysSection;
