
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const EndCallOnSilenceSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const handleEndCallOnSilenceChange = (checked: boolean) => {
    // Enviar valor booleano para end_call_after_silence
    updateAgentField('end_call_after_silence', checked);
    
    // También actualizar el valor en milisegundos
    if (checked) {
      // Si no hay un valor previo, usar 40 segundos (40000ms) como predeterminado
      const currentMs = agent.end_call_after_silence_ms || 40000;
      updateAgentField('end_call_after_silence_ms', currentMs);
    } else {
      // Si se desactiva, el valor en ms se mantiene para recordar la última configuración
      // pero la función está desactivada por el campo booleano
    }
  };

  const handleSilenceDurationChange = (values: number[]) => {
    const duration = values[0];
    updateAgentField('end_call_after_silence_ms', duration * 1000); // Convertir a milisegundos
  };

  // Determinar si la función está habilitada verificando el valor booleano
  const isEnabled = agent.end_call_after_silence === true;
  
  // Obtener el valor actual en segundos para mostrar
  const currentValueInSeconds = agent.end_call_after_silence_ms ? agent.end_call_after_silence_ms / 1000 : 40;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium text-amber-600">End Call on Silence</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isEnabled} 
            onCheckedChange={handleEndCallOnSilenceChange}
          />
          <span className="text-xs text-gray-500">
            {currentValueInSeconds} s
          </span>
        </div>
      </div>
      <Slider 
        defaultValue={[currentValueInSeconds]} 
        min={0} 
        max={120} 
        step={1} 
        className="w-full"
        onValueChange={handleSilenceDurationChange}
        agentId={agent.agent_id}
        fieldName="end_call_after_silence_ms"
        debounceMs={300}
      />
    </div>
  );
};

export default EndCallOnSilenceSection;
