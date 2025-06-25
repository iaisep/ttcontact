
import React from 'react';

const StepsGuide: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          1
        </div>
        <div>
          <h3 className="font-medium text-blue-600">Choose Channel</h3>
          <p className="text-sm text-gray-600">
            Choose the provider you want to integrate with Chatwoot.
          </p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">2</span>
          <span>Create Inbox</span>
        </div>
        <div className="ml-6 text-xs">Authenticate your account and create an Inbox.</div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-400">3</span>
          <span>Add Agents</span>
        </div>
        <div className="ml-6 text-xs">Add agents to the created Inbox.</div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-400">4</span>
          <span>Voilà!</span>
        </div>
        <div className="ml-6 text-xs">You are all set to go!</div>
      </div>
    </div>
  );
};

export default StepsGuide;
