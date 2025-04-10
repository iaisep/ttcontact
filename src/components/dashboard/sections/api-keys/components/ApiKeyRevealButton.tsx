
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ApiKeyRevealButtonProps {
  isRevealed: boolean;
  onClick: () => void;
}

const ApiKeyRevealButton = ({ isRevealed, onClick }: ApiKeyRevealButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={onClick}
      title={isRevealed ? "Hide API key" : "Reveal API key"}
    >
      {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );
};

export default ApiKeyRevealButton;
