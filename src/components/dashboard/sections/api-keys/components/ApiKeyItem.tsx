
import { ApiKey } from "../types";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ApiKeyRevealButton from "./ApiKeyRevealButton";
import { toast } from "sonner";

interface ApiKeyItemProps {
  apiKey: ApiKey;
  revealed: string | null;
  onToggleReveal: () => void;
  onDelete: (id: string) => void;
}

const ApiKeyItem = ({ apiKey, revealed, onToggleReveal, onDelete }: ApiKeyItemProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy to clipboard');
      }
    );
  };

  return (
    <tr key={apiKey.id}>
      <td className="p-4 align-middle font-medium">{apiKey.name}</td>
      <td className="p-4 align-middle">
        <div className="flex items-center space-x-2">
          <code className="bg-muted px-2 py-1 rounded">
            {revealed ? revealed : apiKey.prefix + '••••••••••••'}
          </code>
          <ApiKeyRevealButton 
            isRevealed={!!revealed}
            onClick={onToggleReveal}
          />
        </div>
      </td>
      <td className="p-4 align-middle">
        {new Date(apiKey.created_at).toLocaleDateString()}
      </td>
      <td className="p-4 align-middle">
        {apiKey.last_used 
          ? new Date(apiKey.last_used).toLocaleDateString() 
          : 'Never used'}
      </td>
      <td className="p-4 align-middle text-right">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => copyToClipboard(revealed || `${apiKey.prefix}XXXXXXXXXXXX`)}
          title="Copy API key prefix"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the API key "{apiKey.name}"? This action cannot be undone
                and any applications using this key will no longer be able to access the API.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground"
                onClick={() => onDelete(apiKey.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
};

export default ApiKeyItem;
