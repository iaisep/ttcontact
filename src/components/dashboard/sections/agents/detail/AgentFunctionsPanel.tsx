
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('functions')}</h3>
        <Button size="sm" onClick={handleAddFunction}>
          <Plus size={16} className="mr-1" /> {t('add_function')}
        </Button>
      </div>

      {functionList.length === 0 && !isAddingNew && (
        <div className="text-center py-8 text-muted-foreground">
          {t('no_functions')}
        </div>
      )}

      {functionList.map(func => (
        <Card key={func.id} className="p-4">
          {editingFunction && editingFunction.id === func.id ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('function_name')}</label>
                <Input 
                  value={editingFunction.name} 
                  onChange={(e) => setEditingFunction({...editingFunction, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('function_description')}</label>
                <Textarea 
                  value={editingFunction.description} 
                  onChange={(e) => setEditingFunction({...editingFunction, description: e.target.value})}
                  rows={2}
                />
              </div>
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
                  <Save size={16} className="mr-1" /> {t('save')}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between">
                <h4 className="font-medium">{func.name}</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditFunction(func)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteFunction(func.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{func.description}</p>
            </div>
          )}
        </Card>
      ))}

      {isAddingNew && (
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('function_name')}</label>
              <Input 
                value={newFunction.name} 
                onChange={(e) => setNewFunction({...newFunction, name: e.target.value})}
                placeholder={t('function_name_placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('function_description')}</label>
              <Textarea 
                value={newFunction.description} 
                onChange={(e) => setNewFunction({...newFunction, description: e.target.value})}
                placeholder={t('function_description_placeholder')}
                rows={2}
              />
            </div>
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
                <Save size={16} className="mr-1" /> {t('add')}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AgentFunctionsPanel;
