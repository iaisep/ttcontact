
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface TelegramAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agentData: any) => void;
  isLoading?: boolean;
}

const TelegramAgentModal: React.FC<TelegramAgentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    nameSuffix: '',
    description: '',
    webhookPath: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nameSuffix.trim() || !formData.description.trim() || !formData.webhookPath.trim()) {
      return;
    }

    const payload = {
      name: `Agente_mensajeria_telegram_${formData.nameSuffix}`,
      description: formData.description,
      outgoing_url: `http://n8n:5678/webhook/${formData.webhookPath}`,
      account_id: "1"
    };

    try {
      // Primero creamos el agente
      await onSave(payload);
      
      // Luego llamamos al endpoint de clonación
      const cloneResponse = await fetch('https://flow.totalcontact.com.mx/webhook/clonador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_clonar: "ESbW48HlmIagrWup",
          newPath: formData.webhookPath
        })
      });

      if (!cloneResponse.ok) {
        console.error('Error cloning webhook:', cloneResponse.status);
      } else {
        console.log('Webhook cloned successfully');
      }
    } catch (error) {
      console.error('Error in agent creation process:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      nameSuffix: '',
      description: '',
      webhookPath: ''
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span>✈️</span>
              Crear Agente de Telegram
            </SheetTitle>
            <SheetDescription>
              Configure los detalles para el nuevo agente de Telegram.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nameSuffix">Nombre del Agente</Label>
              <Input
                id="nameSuffix"
                value={formData.nameSuffix}
                onChange={(e) => setFormData(prev => ({...prev, nameSuffix: e.target.value}))}
                placeholder="funcion que describe al agente"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                placeholder="Describe la función del agente..."
                required
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="webhookPath">Texto de comunicación</Label>
              <Input
                id="webhookPath"
                value={formData.webhookPath}
                onChange={(e) => setFormData(prev => ({...prev, webhookPath: e.target.value}))}
                placeholder="telegram1"
                required
              />
            </div>
          </div>

          <SheetFooter className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.nameSuffix.trim() || !formData.description.trim() || !formData.webhookPath.trim()}
            >
              {isLoading ? 'Creando...' : 'Crear Agente'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default TelegramAgentModal;
