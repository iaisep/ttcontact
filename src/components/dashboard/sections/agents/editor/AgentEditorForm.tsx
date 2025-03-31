
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RetellAgent, RetellVoice, RetellFolder } from '@/components/dashboard/sections/agents/types/retell-types';
import { Flag, ChevronDown } from 'lucide-react';
import { debounce } from 'lodash';
import { Button } from '@/components/ui/button';

interface AgentEditorFormProps {
  agent: RetellAgent;
  voices: RetellVoice[];
  folders: RetellFolder[];
  onUpdateField: (fieldName: string, value: any) => void;
  onOpenVoiceSelector: () => void;
}

const AgentEditorForm: React.FC<AgentEditorFormProps> = ({
  agent,
  voices,
  folders,
  onUpdateField,
  onOpenVoiceSelector
}) => {
  const { t } = useLanguage();

  // Create state for editable fields
  const [name, setName] = useState(agent.agent_name || agent.name || '');
  const [description, setDescription] = useState(agent.description || '');
  const [voiceId, setVoiceId] = useState(agent.voice_id || '');
  const [folder, setFolder] = useState(agent.folder || '');
  const [language, setLanguage] = useState(agent.language || 'en-US');
  
  // Use optional chaining and type guards for response_engine properties
  const initialPrompt = agent.response_engine && 
    typeof agent.response_engine === 'object' ? 
    (agent.response_engine as any).prompt || 
    (agent.response_engine as any).general_prompt || 
    '' : '';
  
  const [generalPrompt, setGeneralPrompt] = useState(initialPrompt);
  const [beginMessage, setBeginMessage] = useState(agent.begin_message || '');

  // Create debounced update functions
  const debouncedUpdateName = debounce((value) => onUpdateField('agent_name', value), 1000);
  const debouncedUpdateDescription = debounce((value) => onUpdateField('description', value), 1000);
  const debouncedUpdateGeneralPrompt = debounce((value) => {
    if (agent.response_engine?.type === 'retell-llm') {
      onUpdateField('response_engine.general_prompt', value);
    } else {
      onUpdateField('response_engine.prompt', value);
    }
  }, 1000);
  const debouncedUpdateBeginMessage = debounce((value) => onUpdateField('begin_message', value), 1000);

  // Language options with flag icons
  const languageOptions = [
    { value: 'es-ES', label: 'Spanish', icon: <Flag className="h-4 w-4 text-red-600" /> },
    { value: 'en-US', label: 'English (US)', icon: <Flag className="h-4 w-4 text-blue-600" /> },
    { value: 'en-GB', label: 'English (UK)', icon: <Flag className="h-4 w-4 text-blue-900" /> },
    { value: 'fr-FR', label: 'French', icon: <Flag className="h-4 w-4 text-blue-800" /> },
    { value: 'de-DE', label: 'German', icon: <Flag className="h-4 w-4 text-black" /> },
    { value: 'it-IT', label: 'Italian', icon: <Flag className="h-4 w-4 text-green-600" /> },
    { value: 'pt-BR', label: 'Portuguese (Brazil)', icon: <Flag className="h-4 w-4 text-green-700" /> },
    { value: 'es-419', label: 'Spanish (Latin America)', icon: <Flag className="h-4 w-4 text-yellow-600" /> },
  ];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    debouncedUpdateName(value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    debouncedUpdateDescription(value);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFolder(value);
    onUpdateField('folder', value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLanguage(value);
    onUpdateField('language', value);
  };

  const handleGeneralPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setGeneralPrompt(value);
    debouncedUpdateGeneralPrompt(value);
  };

  const handleBeginMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBeginMessage(value);
    debouncedUpdateBeginMessage(value);
  };
  
  // Find current selected voice
  const currentVoice = voices.find(v => v.id === voiceId);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Agente</Label>
            <Input 
              id="name"
              value={name}
              onChange={handleNameChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voice">Voz</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-1 flex items-center justify-between h-10 px-3 py-2 text-left"
                onClick={onOpenVoiceSelector}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {currentVoice?.avatar_url ? (
                      <img src={currentVoice.avatar_url} alt={currentVoice.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold">
                        {currentVoice?.name?.substring(0, 2).toUpperCase() || 'VO'}
                      </span>
                    )}
                  </div>
                  <span>
                    {currentVoice?.name || 'Seleccionar voz'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
            
            <div>
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className="w-full mt-1 border border-input rounded-md h-10 px-3 py-2"
              >
                {languageOptions.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="folder">Carpeta</Label>
              <select
                id="folder"
                value={folder}
                onChange={handleFolderChange}
                className="w-full mt-1 border border-input rounded-md h-10 px-3 py-2"
              >
                <option value="">Sin carpeta</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name || folder.folderName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <Tabs defaultValue="instructions">
          <TabsList className="mb-4">
            <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
            <TabsTrigger value="beginMessage">Mensaje inicial</TabsTrigger>
            <TabsTrigger value="configuration">Configuración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instructions">
            <div>
              <Label htmlFor="generalPrompt">Instrucciones generales</Label>
              <Textarea
                id="generalPrompt"
                value={generalPrompt}
                onChange={handleGeneralPromptChange}
                rows={15}
                className="font-mono text-sm mt-1"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="beginMessage">
            <div>
              <Label htmlFor="beginMessage">Mensaje inicial</Label>
              <Textarea
                id="beginMessage"
                value={beginMessage}
                onChange={handleBeginMessageChange}
                rows={8}
                className="font-mono text-sm mt-1"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="configuration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Configuración de llamada</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxCallDuration">Duración máxima de llamada (ms)</Label>
                    <Input 
                      id="maxCallDuration"
                      type="number"
                      value={agent.max_call_duration_ms || 3600000}
                      onChange={(e) => onUpdateField('max_call_duration_ms', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="voicemailTimeout">Tiempo de espera para buzón (ms)</Label>
                    <Input 
                      id="voicemailTimeout"
                      type="number"
                      value={agent.voicemail_detection_timeout_ms || 30000}
                      onChange={(e) => onUpdateField('voicemail_detection_timeout_ms', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Configuración avanzada</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="optOutStorage"
                      checked={agent.opt_out_sensitive_data_storage || false}
                      onChange={(e) => onUpdateField('opt_out_sensitive_data_storage', e.target.checked)}
                      className="mr-2"
                    />
                    <Label htmlFor="optOutStorage">Excluir almacenamiento de datos sensibles</Label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableVoicemail"
                      checked={agent.enable_voicemail_detection || false}
                      onChange={(e) => onUpdateField('enable_voicemail_detection', e.target.checked)}
                      className="mr-2"
                    />
                    <Label htmlFor="enableVoicemail">Habilitar detección de buzón</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AgentEditorForm;
