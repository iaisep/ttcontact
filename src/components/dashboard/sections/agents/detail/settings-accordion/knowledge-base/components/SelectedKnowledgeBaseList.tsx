
import React from 'react';
import { FileText, Trash } from 'lucide-react';

interface SelectedKnowledgeBaseListProps {
  selectedKbs: string[];
  getKnowledgeBaseName: (kbId: string) => string;
  handleDeleteKnowledgeBase: (kbId: string, event: React.MouseEvent) => void;
}

const SelectedKnowledgeBaseList: React.FC<SelectedKnowledgeBaseListProps> = ({
  selectedKbs,
  getKnowledgeBaseName,
  handleDeleteKnowledgeBase
}) => {
  if (selectedKbs.length === 0) {
    return <p className="text-sm text-gray-500 italic">No knowledge bases selected</p>;
  }

  return (
    <div className="space-y-2">
      {selectedKbs.map((kbId) => (
        <div key={kbId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{getKnowledgeBaseName(kbId)}</span>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={(e) => handleDeleteKnowledgeBase(kbId, e)}
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedKnowledgeBaseList;
