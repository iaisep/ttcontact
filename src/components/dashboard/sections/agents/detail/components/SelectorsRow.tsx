
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, User, Settings, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SelectorsRowProps {
  selectedLlmModel: string;
  selectedVoice: string;
  selectedLanguage: string;
  languageOptions: Array<{ value: string, label: string, icon: string }>;
  llmOptions: string[];
  handleLanguageChange: (lang: string) => void;
  handleLlmChange: (llm: string) => void;
  openVoiceModal: () => void;
  isLoadingLlmOptions?: boolean;
  
  // LLM Settings props
  isLlmSettingsOpen: boolean;
  setIsLlmSettingsOpen: (isOpen: boolean) => void;
  llmTemperature: number;
  setLlmTemperature: (temp: number) => void;
  structuredOutput: boolean;
  setStructuredOutput: (structured: boolean) => void;
  highPriority: boolean;
  setHighPriority: (priority: boolean) => void;
  handleSaveLlmSettings: () => void;
  
  // Voice Settings props
  isVoiceSettingsOpen: boolean;
  setIsVoiceSettingsOpen: (isOpen: boolean) => void;
  voiceModel: string;
  setVoiceModel: (model: string) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  voiceTemperature: number;
  setVoiceTemperature: (temp: number) => void;
  voiceVolume: number;
  setVoiceVolume: (volume: number) => void;
  voiceModelOptions: Array<{ id: string, label: string, description: string }>;
  handleSaveVoiceSettings: () => void;
}

const SelectorsRow: React.FC<SelectorsRowProps> = ({
  selectedLlmModel,
  selectedVoice,
  selectedLanguage,
  languageOptions,
  llmOptions,
  handleLanguageChange,
  handleLlmChange,
  openVoiceModal,
  isLoadingLlmOptions = false,
  
  // LLM Settings
  isLlmSettingsOpen,
  setIsLlmSettingsOpen,
  llmTemperature,
  setLlmTemperature,
  structuredOutput,
  setStructuredOutput,
  highPriority,
  setHighPriority,
  handleSaveLlmSettings,
  
  // Voice Settings
  isVoiceSettingsOpen,
  setIsVoiceSettingsOpen,
  voiceModel,
  setVoiceModel,
  voiceSpeed,
  setVoiceSpeed,
  voiceTemperature,
  setVoiceTemperature,
  voiceVolume,
  setVoiceVolume,
  voiceModelOptions,
  handleSaveVoiceSettings,
}) => {
  return (
    <div className="flex items-center space-x-3">
      {/* LLM Model Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-gray-50 text-gray-700">
            {isLoadingLlmOptions ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span>{selectedLlmModel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white">
          {isLoadingLlmOptions ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Loading models...</span>
            </div>
          ) : (
            llmOptions.map((option) => (
              <DropdownMenuItem key={option} onClick={() => handleLlmChange(option)}>
                {option}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* LLM Settings Button */}
      <Popover open={isLlmSettingsOpen} onOpenChange={setIsLlmSettingsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full bg-gray-50">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white">
          <div className="space-y-4">
            <h3 className="font-medium">LLM Temperature</h3>
            <p className="text-xs text-muted-foreground">Lower value yields better function call results.</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm"></span>
                <span className="text-sm">{llmTemperature.toFixed(2)}</span>
              </div>
              <Slider
                value={[llmTemperature]}
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

      {/* Voice Selector */}
      <Button 
        variant="outline" 
        className="flex items-center gap-2 bg-gray-50 text-gray-700"
        onClick={openVoiceModal}
      >
        <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-white">
          <User className="h-3 w-3" />
        </div>
        <span>{selectedVoice}</span>
      </Button>

      {/* Voice Settings Button */}
      <Popover open={isVoiceSettingsOpen} onOpenChange={setIsVoiceSettingsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full bg-gray-50">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h3 className="font-medium">Voice Model</h3>
            <RadioGroup 
              value={voiceModel} 
              onValueChange={setVoiceModel}
              className="space-y-2"
            >
              {voiceModelOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Voice Speed</Label>
                <span className="text-sm">{voiceSpeed.toFixed(2)}</span>
              </div>
              <Slider
                value={[voiceSpeed]}
                min={0.25}
                max={2.0}
                step={0.01}
                onValueChange={([value]) => setVoiceSpeed(value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Voice Temperature</Label>
                <span className="text-sm">{voiceTemperature.toFixed(2)}</span>
              </div>
              <Slider
                value={[voiceTemperature]}
                min={0}
                max={1.0}
                step={0.01}
                onValueChange={([value]) => setVoiceTemperature(value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Voice Volume</Label>
                <span className="text-sm">{voiceVolume.toFixed(2)}</span>
              </div>
              <Slider
                value={[voiceVolume]}
                min={0}
                max={1.0}
                step={0.01}
                onValueChange={([value]) => setVoiceVolume(value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsVoiceSettingsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSaveVoiceSettings}
              >
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-gray-50 text-gray-700">
            <span className="text-base">
              {languageOptions.find(l => l.label === selectedLanguage)?.icon || '🌐'}
            </span>
            <span>{selectedLanguage}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white">
          {languageOptions.map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => handleLanguageChange(option.label)}>
              <span className="mr-2">{option.icon}</span>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectorsRow;
