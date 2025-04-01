
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface LlmSettingsPopoverProps {
  isLlmSettingsOpen: boolean;
  setIsLlmSettingsOpen: (isOpen: boolean) => void;
  llmTemperature: number;
  setLlmTemperature: (temp: number) => void;
  structuredOutput: boolean;
  setStructuredOutput: (structured: boolean) => void;
  highPriority: boolean;
  setHighPriority: (priority: boolean) => void;
  handleSaveLlmSettings: () => void;
}

const LlmSettingsPopover: React.FC<LlmSettingsPopoverProps> = ({
  isLlmSettingsOpen,
  setIsLlmSettingsOpen,
  llmTemperature = 0, // Provide default value to prevent undefined
  setLlmTemperature,
  structuredOutput = false, // Provide default value
  setStructuredOutput,
  highPriority = false, // Provide default value
  setHighPriority,
  handleSaveLlmSettings,
}) => {
  // Ensure temperature is a number and has a fallback
  const temperature = typeof llmTemperature === 'number' ? llmTemperature : 0;
  const displayTemperature = temperature.toFixed(2);
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="rounded-full bg-gray-50"
      onClick={() => setIsLlmSettingsOpen(true)}
    >
      <Settings className="h-4 w-4" />
      
      <Popover open={isLlmSettingsOpen} onOpenChange={setIsLlmSettingsOpen}>
        <PopoverContent className="w-80 bg-white">
          <div className="space-y-4">
            <h3 className="font-medium">LLM Settings</h3>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Temperature</h4>
              <p className="text-xs text-muted-foreground">Lower value yields better function call results.</p>
              <div className="flex justify-between">
                <span className="text-sm"></span>
                <span className="text-sm">{displayTemperature}</span>
              </div>
              <Slider
                value={[temperature]}
                min={0}
                max={1.0}
                step={0.01}
                onValueChange={([value]) => setLlmTemperature(value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="structured-output">Structured Output</Label>
                  <p className="text-xs text-muted-foreground">Always generate responses that adhere to your supplied JSON Schema. This will make functions longer to save or update.</p>
                </div>
                <Switch
                  id="structured-output"
                  checked={structuredOutput}
                  onCheckedChange={setStructuredOutput}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-priority">High Priority</Label>
                  <p className="text-xs text-muted-foreground">Use more dedicated resource pool to ensure lower and more consistent latency. This feature incurs a higher cost.</p>
                </div>
                <Switch
                  id="high-priority"
                  checked={highPriority}
                  onCheckedChange={setHighPriority}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLlmSettingsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSaveLlmSettings}
              >
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Button>
  );
};

export default LlmSettingsPopover;
