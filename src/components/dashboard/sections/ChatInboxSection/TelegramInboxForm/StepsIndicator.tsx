
import React from 'react';

interface StepsIndicatorProps {
  currentStep: number;
}

const StepsIndicator: React.FC<StepsIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            ✓
          </div>
          <span className="ml-2 text-green-600">Choose Channel</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
          <span className={`ml-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Create Inbox</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            3
          </div>
          <span className={`ml-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>Add Agents</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            currentStep >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            4
          </div>
          <span className={`ml-2 ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-500'}`}>Voilà!</span>
        </div>
      </div>
    </div>
  );
};

export default StepsIndicator;
