
import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/context/LanguageContext';

interface VoiceCloneTabProps {
  onAddVoice: (name: string, audioFile: File) => Promise<void>;
  isLoading: boolean;
}

const VoiceCloneTab: React.FC<VoiceCloneTabProps> = ({ 
  onAddVoice,
  isLoading
}) => {
  const { t } = useLanguage();
  const [voiceName, setVoiceName] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAudioFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const isFormValid = voiceName.trim() !== '' && audioFile !== null;

  const handleSubmit = () => {
    if (isFormValid && audioFile) {
      onAddVoice(voiceName, audioFile);
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
          placeholder={t('enter_a_voice_name') || 'Enter a voice name'}
          value={voiceName}
          onChange={(e) => setVoiceName(e.target.value)}
          disabled={isLoading}
          className="mt-1"
        />
      </div>

      <div>
        <Label>
          {t('upload_audio_clip') || 'Upload audio clip'}
        </Label>
        <div
          className="border-2 border-dashed rounded-md p-8 mt-1 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*,video/*"
            className="hidden"
            disabled={isLoading}
          />
          
          {audioFile ? (
            <div className="text-center">
              <p className="font-medium">{audioFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-2"
              >
                <path d="m21 15-9-9-9 9" />
                <path d="M3 10.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8.5" />
              </svg>
              <p className="text-sm text-muted-foreground">{t('choose_a_file_or_drag_drop_it_here') || 'Choose a file or drag & drop it here'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('audio_and_video_formats_up_to_10_mb') || 'Audio and video formats, up to 10 MB'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceCloneTab;
