
import { Button } from "@/components/ui/button";
import { Key, Plus } from "lucide-react";

interface ApiKeyHeaderProps {
  onCreateClick: () => void;
}

const ApiKeyHeader = ({ onCreateClick }: ApiKeyHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">API Keys</h3>
            <p className="text-sm text-muted-foreground mt-1">
              API keys allow applications to authenticate with our API. Keep your API keys secure and never share them publicly.
              If you believe an API key has been compromised, you should revoke it immediately and create a new one.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApiKeyHeader;
