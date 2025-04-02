
import React, { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface LlmSettingsModalProps {
  open: boolean;
  onClose: () => void;
  llmId: string | undefined;
  initialTemperature: number;
  initialStructuredOutput: boolean;
  initialHighPriority: boolean;
  onSettingsUpdated: () => void;
}

const LlmSettingsModal: React.FC<LlmSettingsModalProps> = ({
  open,
  onClose,
  llmId,
  initialTemperature,
  initialStructuredOutput,
  initialHighPriority,
  onSettingsUpdated,
}) => {
  const { fetchWithAuth } = useApiContext();
  const { t } = useLanguage();
  
  const [temperature, setTemperature] = useState<number>(initialTemperature || 0.7);
  const [structuredOutput, setStructuredOutput] = useState<boolean>(initialStructuredOutput || false);
  const [highPriority, setHighPriority] = useState<boolean>(initialHighPriority || false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Update state when props change
  useEffect(() => {
    if (initialTemperature !== undefined) {
      setTemperature(initialTemperature);
    }
    if (initialStructuredOutput !== undefined) {
      setStructuredOutput(initialStructuredOutput);
    }
    if (initialHighPriority !== undefined) {
      setHighPriority(initialHighPriority);
    }
  }, [initialTemperature, initialStructuredOutput, initialHighPriority, open]);

  const handleTemperatureChange = (values: number[]) => {
    setTemperature(values[0]);
  };

  const handleSave = async () => {
    if (!llmId) return;
    
    setIsSubmitting(true);
    try {
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          model_temperature: temperature,
          tool_call_strict_mode: structuredOutput,
          model_high_priority: highPriority
        })
      });
      
      toast.success(t('settings_updated') || 'LLM settings updated successfully');
      onSettingsUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating LLM settings:', error);
      toast.error(t('error_updating_llm_settings') || 'Error updating LLM settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">LLM Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">LLM Temperature</Label>
              <span className="text-sm text-muted-foreground">{temperature.toFixed(2)}</span>
            </div>
            <Slider 
              value={[temperature]} 
              onValueChange={handleTemperatureChange} 
              min={0} 
              max={1} 
              step={0.01} 
              className="w-full" 
            />
            <p className="text-xs text-muted-foreground">Lower value yields better function call results.</p>
          </div>
          
          {/* Structured Output Switch */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="structured-output" className="text-sm font-medium">Structured Output</Label>
              <p className="text-xs text-muted-foreground">
                Always generate responses that adhere to your specified JSON schemas. This will make functions longer to serve or update.
              </p>
            </div>
            <Switch 
              id="structured-output"
              checked={structuredOutput} 
              onCheckedChange={setStructuredOutput} 
            />
          </div>
          
          {/* High Priority Switch */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="high-priority" className="text-sm font-medium">High Priority</Label>
              <p className="text-xs text-muted-foreground">
                Use more dedicated resource pool to ensure lower and more consistent latency. This feature incurs a higher cost.
              </p>
            </div>
            <Switch 
              id="high-priority"
              checked={highPriority} 
              onCheckedChange={setHighPriority} 
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LlmSettingsModal;
