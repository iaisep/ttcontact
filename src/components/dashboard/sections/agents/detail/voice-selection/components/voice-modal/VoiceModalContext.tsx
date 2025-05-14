
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CommunityVoice } from '../../types';

interface VoiceModalContextProps {
  isLoading: boolean;
  termsAccepted: boolean;
  selectedVoice: CommunityVoice | null;
  voiceName: string;
  audioFile: File | null;
  activeTab: string;
  isSaveEnabled: boolean;
  setIsLoading: (loading: boolean) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setSelectedVoice: (voice: CommunityVoice | null) => void;
  setVoiceName: (name: string) => void;
  setAudioFile: (file: File | null) => void;
  setActiveTab: (tab: string) => void;
  updateSaveEnabledState: () => void;
}

const VoiceModalContext = createContext<VoiceModalContextProps | undefined>(undefined);

export const VoiceModalProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<CommunityVoice | null>(null);
  const [voiceName, setVoiceName] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>("voice-clone");
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const updateSaveEnabledState = () => {
    const isEnabled = termsAccepted && (
      (activeTab === "community-voices" && selectedVoice !== null) ||
      (activeTab === "voice-clone" && voiceName !== '' && audioFile !== null)
    );
    setIsSaveEnabled(isEnabled);
  };

  // Update save button state when dependencies change
  React.useEffect(() => {
    updateSaveEnabledState();
  }, [termsAccepted, selectedVoice, voiceName, audioFile, activeTab]);

  const value = {
    isLoading,
    termsAccepted,
    selectedVoice,
    voiceName,
    audioFile,
    activeTab,
    isSaveEnabled,
    setIsLoading,
    setTermsAccepted,
    setSelectedVoice,
    setVoiceName,
    setAudioFile,
    setActiveTab,
    updateSaveEnabledState
  };

  return (
    <VoiceModalContext.Provider value={value}>
      {children}
    </VoiceModalContext.Provider>
  );
};

export const useVoiceModal = (): VoiceModalContextProps => {
  const context = useContext(VoiceModalContext);
  if (context === undefined) {
    throw new Error('useVoiceModal must be used within a VoiceModalProvider');
  }
  return context;
};
