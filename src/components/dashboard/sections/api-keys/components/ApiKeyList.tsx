
import { ApiKey } from "../types";
import ApiKeyItem from "./ApiKeyItem";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Key, Plus, Loader2 } from "lucide-react";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  loading: boolean;
  revealedApiKeys: { [key: string]: string | null };
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

const ApiKeyList = ({ 
  apiKeys, 
  loading, 
  revealedApiKeys, 
  onToggleVisibility, 
  onDelete,
  onCreateClick
}: ApiKeyListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredApiKeys = apiKeys.filter(key => key.is_active); // Only show active keys
  const hasActiveKeys = filteredApiKeys.length > 0;

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasActiveKeys ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Key className="h-8 w-8 text-muted-foreground" />
                  <p>No active API keys found</p>
                  <Button variant="outline" size="sm" onClick={onCreateClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First API Key
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredApiKeys.map((apiKey) => (
              <ApiKeyItem
                key={apiKey.id}
                apiKey={apiKey}
                revealed={revealedApiKeys[apiKey.id]}
                onToggleReveal={() => onToggleVisibility(apiKey.id)}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApiKeyList;
