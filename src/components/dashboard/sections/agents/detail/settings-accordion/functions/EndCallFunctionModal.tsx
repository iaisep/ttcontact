
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, X } from 'lucide-react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface EndCallFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: RetellAgent;
  onSuccess?: () => void;
}

const EndCallFunctionModal: React.FC<EndCallFunctionModalProps> = ({ 
  isOpen, 
  onClose,
  agent,
  onSuccess
}) => {
  const [name, setName] = useState("end_call");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchWithAuth } = useApiContext();

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const llmId = agent?.response_engine?.llm_id;
    if (!llmId) {
      toast.error("LLM ID not found");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        general_tools: [
          {
            name: name,
            description: description,
            type: "end_call"
          }
        ]
      };
      
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      
      toast.success("End Call function added successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving End Call function:", error);
      toast.error("Failed to add End Call function");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">End Call</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">Name</label>
            <Input 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter function name"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium">
              Description <span className="text-muted-foreground">(Optional)</span>
            </label>
            <Textarea 
              id="description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter function description"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndCallFunctionModal;
