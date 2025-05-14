
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/context/LanguageContext';
import { Upload } from 'lucide-react';

interface VoiceCloneTabProps {
  onAddVoice: (name: string, audioFile: File) => void;
  isLoading: boolean;
}

const VoiceCloneTab: React.FC<VoiceCloneTabProps> = ({
  onAddVoice,
  isLoading
}) => {
  const { t } = useLanguage();
  const [voiceName, setVoiceName] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setFileName(file.name);
      // Update parent component with current values
      onAddVoice(voiceName, file);
    }
  };

  // Handle browse button click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle voice name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoiceName(e.target.value);
    // Update parent component if we already have a file
    if (audioFile) {
      onAddVoice(e.target.value, audioFile);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="voice-name">
          {t('voice_name') || 'Voice Name'}
        </Label>
        <Input
          id="voice-name"
          placeholder={t('enter_voice_name') || 'Enter voice name'}
          value={voiceName}
          onChange={handleNameChange}
          disabled={isLoading}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="audio-file">
          {t('audio_file') || 'Audio File'}
        </Label>
        <div className="mt-1 flex items-center gap-2">
          <Input
            id="audio-display"
            value={fileName}
            readOnly
            placeholder={t('no_file_selected') || 'No file selected'}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleBrowseClick}
            disabled={isLoading}
            className="flex-shrink-0"
          >
            <Upload className="h-4 w-4 mr-1" />
            {t('browse') || 'Browse'}
          </Button>
          <input
            ref={fileInputRef}
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {t('supported_formats') || 'Supported formats'}: MP3, WAV, M4A (1-2 minutes in length)
        </p>
      </div>
    </div>
  );
};

export default VoiceCloneTab;
