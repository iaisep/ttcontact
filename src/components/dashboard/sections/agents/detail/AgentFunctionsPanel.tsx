
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { RetellFunction } from '@/components/dashboard/sections/agents/types/retell-types';
import { Plus, Trash, Edit, Save } from 'lucide-react';

interface AgentFunctionsPanelProps {
  functions: RetellFunction[];
  onUpdate: (functions: RetellFunction[]) => void;
}

const AgentFunctionsPanel: React.FC<AgentFunctionsPanelProps> = ({ functions, onUpdate }) => {
  const { t } = useLanguage();
  const [functionList, setFunctionList] = useState<RetellFunction[]>(functions || []);
  const [editingFunction, setEditingFunction] = useState<RetellFunction | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFunction, setNewFunction] = useState<RetellFunction>({
    id: '',
    name: '',
    description: '',
    parameters: {}
  });

  const handleAddFunction = () => {
    setIsAddingNew(true);
    setNewFunction({
      id: `function_${Date.now()}`,
      name: '',
      description: '',
      parameters: {}
    });
  };

  const handleSaveNewFunction = () => {
    if (!newFunction.name) return;
    
    const updatedFunctions = [...functionList, newFunction];
    setFunctionList(updatedFunctions);
    onUpdate(updatedFunctions);
    setIsAddingNew(false);
    setNewFunction({
      id: '',
      name: '',
      description: '',
      parameters: {}
    });
  };

  const handleEditFunction = (func: RetellFunction) => {
    setEditingFunction({ ...func });
  };

  const handleUpdateFunction = () => {
    if (!editingFunction) return;
    
    const updatedFunctions = functionList.map(f => 
      f.id === editingFunction.id ? editingFunction : f
    );
    
    setFunctionList(updatedFunctions);
    onUpdate(updatedFunctions);
    setEditingFunction(null);
  };

  const handleDeleteFunction = (id: string) => {
    const updatedFunctions = functionList.filter(f => f.id !== id);
    setFunctionList(updatedFunctions);
    onUpdate(updatedFunctions);
  };

  return (
    <div className="space-y-2">
      {functionList.map(func => (
        <div key={func.id} className="flex items-center justify-between border rounded-md p-2">
          {editingFunction && editingFunction.id === func.id ? (
            <div className="w-full space-y-2">
              <Input 
                value={editingFunction.name} 
                onChange={(e) => setEditingFunction({...editingFunction, name: e.target.value})}
                className="text-sm"
                placeholder={t('function_name')}
              />
              <Textarea 
                value={editingFunction.description} 
                onChange={(e) => setEditingFunction({...editingFunction, description: e.target.value})}
                className="text-sm min-h-[60px]"
                placeholder={t('function_description')}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingFunction(null)}
                >
                  {t('cancel')}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUpdateFunction}
                >
                  <Save size={14} className="mr-1" /> {t('save')}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <path d="M17 6.1H3"></path><path d="M21 12.5H3"></path><path d="M15.9 18.9H3"></path><path d="m14 12.5 6.3-6.4"></path><path d="M14 12.5v6.4"></path>
                </svg>
                <span className="text-sm">{func.name}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEditFunction(func)}>
                  <Edit size={14} />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDeleteFunction(func.id)}>
                  <Trash size={14} />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}

      {isAddingNew && (
        <div className="border rounded-md p-2 space-y-2">
          <Input 
            value={newFunction.name} 
            onChange={(e) => setNewFunction({...newFunction, name: e.target.value})}
            className="text-sm"
            placeholder={t('function_name_placeholder')}
          />
          <Textarea 
            value={newFunction.description} 
            onChange={(e) => setNewFunction({...newFunction, description: e.target.value})}
            className="text-sm min-h-[60px]"
            placeholder={t('function_description_placeholder')}
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddingNew(false)}
            >
              {t('cancel')}
            </Button>
            <Button 
              size="sm" 
              onClick={handleSaveNewFunction}
              disabled={!newFunction.name}
            >
              <Save size={14} className="mr-1" /> {t('add')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentFunctionsPanel;
