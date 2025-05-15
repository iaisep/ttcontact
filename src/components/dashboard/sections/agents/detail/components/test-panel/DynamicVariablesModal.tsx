
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import { X, Plus, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface DynamicVariable {
  name: string;
  value: string;
}

interface DynamicVariablesModalProps {
  open: boolean;
  onClose: () => void;
  agentId?: string;
}

const DynamicVariablesModal: React.FC<DynamicVariablesModalProps> = ({
  open,
  onClose,
  agentId
}) => {
  const { t } = useLanguage();
  const [variables, setVariables] = useState<DynamicVariable[]>([]);
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  // Load variables from localStorage when the modal opens
  useEffect(() => {
    if (open && agentId) {
      const storedVars = localStorage.getItem(`dynamicvariables_agent_${agentId}`);
      if (storedVars) {
        try {
          const parsedVars = JSON.parse(storedVars);
          setVariables(parsedVars);
        } catch (e) {
          console.error('Failed to parse stored variables:', e);
        }
      }
    }
  }, [open, agentId]);

  const handleAddVariable = () => {
    if (newVarName.trim() === '') return;

    const newVar = {
      name: newVarName,
      value: newVarValue
    };

    setVariables([...variables, newVar]);
    setNewVarName('');
    setNewVarValue('');
  };

  const handleRemoveVariable = (index: number) => {
    const updatedVars = [...variables];
    updatedVars.splice(index, 1);
    setVariables(updatedVars);
  };

  const handleSave = () => {
    if (agentId) {
      localStorage.setItem(`dynamicvariables_agent_${agentId}`, JSON.stringify(variables));
      toast.success("Variables saved successfully");
    }
    onClose();
  };

  const handleCopyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };
  
  // Handler for auto-saving variable values when leaving the textbox
  const handleVariableValueChange = (index: number, value: string) => {
    const updatedVars = [...variables];
    updatedVars[index].value = value;
    setVariables(updatedVars);
    
    // Save to localStorage whenever a value is updated
    if (agentId) {
      localStorage.setItem(`dynamicvariables_agent_${agentId}`, JSON.stringify(updatedVars));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Default Dynamic Variables</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Set default values for dynamic variables
          </p>
          
          <div className="bg-muted/50 p-2 rounded-md mb-4">
            <div className="flex justify-between py-2 px-2 bg-muted rounded-sm">
              <div className="w-1/2 font-medium text-sm">Variable Name</div>
              <div className="w-1/2 font-medium text-sm">Default Value</div>
            </div>
            
            {variables.map((variable, index) => (
              <div key={index} className="flex items-center mt-2">
                <div className="w-1/2 pr-2">
                  <div className="p-2 bg-background border rounded-md text-sm overflow-hidden text-ellipsis">
                    {variable.name}
                  </div>
                </div>
                <div className="w-1/2 pr-2">
                  <input
                    type="text"
                    value={variable.value}
                    onChange={(e) => {
                      const updatedVars = [...variables];
                      updatedVars[index].value = e.target.value;
                      setVariables(updatedVars);
                    }}
                    onBlur={(e) => handleVariableValueChange(index, e.target.value)}
                    className="p-2 bg-background border rounded-md text-sm w-full"
                  />
                </div>
                <button 
                  onClick={() => handleRemoveVariable(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            <div className="flex items-center mt-3">
              <div className="w-1/2 pr-2">
                <input
                  type="text"
                  value={newVarName}
                  onChange={(e) => setNewVarName(e.target.value)}
                  placeholder="Enter the variable name"
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div className="w-1/2 pr-2">
                <div className="flex">
                  <input
                    type="text"
                    value={newVarValue}
                    onChange={(e) => setNewVarValue(e.target.value)}
                    placeholder="Enter the value"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <button 
                    onClick={() => handleCopyValue(newVarValue)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="w-8"></div>
            </div>
            
            <Button 
              onClick={handleAddVariable} 
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicVariablesModal;
