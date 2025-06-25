
import React from 'react';
import type { Channel } from './types';

interface ChannelGridProps {
  channels: Channel[];
  onChannelClick: (channel: Channel) => void;
}

const ChannelGrid: React.FC<ChannelGridProps> = ({ channels, onChannelClick }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`relative p-6 border rounded-lg text-center cursor-pointer transition-all ${
            channel.enabled 
              ? 'hover:border-blue-500 hover:shadow-md' 
              : 'opacity-50 cursor-not-allowed bg-gray-50'
          }`}
          onClick={() => onChannelClick(channel)}
        >
          <div className={`w-16 h-16 ${channel.color} rounded-lg mx-auto mb-3 flex items-center justify-center text-white text-2xl`}>
            {channel.icon}
          </div>
          <h3 className="font-medium">{channel.name}</h3>
          {!channel.enabled && (
            <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-500 font-medium">Coming Soon</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChannelGrid;
