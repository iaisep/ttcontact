
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { WebsiteConfigData } from '../../WebsiteConfigTypes';

interface ChannelAvatarSectionProps {
  configData: WebsiteConfigData;
  updateConfigData: (field: keyof WebsiteConfigData, value: any) => void;
}

const ChannelAvatarSection: React.FC<ChannelAvatarSectionProps> = ({
  configData,
  updateConfigData
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      updateConfigData('channelAvatar', file.name);
    }
  };

  return (
    <div>
      <Label htmlFor="channel-avatar">Channel Avatar</Label>
      <div className="mt-1 flex items-center space-x-2">
        <Input
          id="channel-avatar"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <span className="text-sm text-gray-500">
          {configData.channelAvatar ? `Selected: ${configData.channelAvatar}` : 'Ningun archivo seleccionado'}
        </span>
      </div>
    </div>
  );
};

export default ChannelAvatarSection;
