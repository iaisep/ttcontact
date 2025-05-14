
import React, { useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from '../types';
import { PostCallAnalysisItem } from '@/components/dashboard/sections/agents/types/retell-types';

// Import our modular components
import TextFieldModal from './TextFieldModal';
import SelectorFieldModal from './SelectorFieldModal';
import BooleanFieldModal from './BooleanFieldModal';
import AnalysisItem from './AnalysisItem';
import AddFieldDropdown from './AddFieldDropdown';
import ModelSelector from './ModelSelector';

const PostCallAnalysisSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const { t } = useLanguage();
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PostCallAnalysisItem | undefined>(undefined);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Initialize post-call data from agent if it exists or empty array if not
  const postCallData = agent.post_call_analysis_data || [];
  const analysisModel = agent.post_call_analysis_model || 'gpt-4o-mini';
  
  const handleOpenModal = (type: string) => {
    setModalType(type);
    setEditingItem(undefined);
    setEditingIndex(null);
    setIsMenuOpen(false);
  };
  
  const handleCloseModal = () => {
    setModalType(null);
    setEditingItem(undefined);
    setEditingIndex(null);
  };
  
  const handleEditItem = (item: PostCallAnalysisItem, index: number) => {
    // Convert type from API format to UI format
    let modalType = item.type;
    if (item.type === 'string') modalType = 'text';
    if (item.type === 'enum') modalType = 'selector';
    
    setModalType(modalType);
    setEditingItem(item);
    setEditingIndex(index);
  };

  const handleSaveItem = (item: PostCallAnalysisItem) => {
    let updatedData: PostCallAnalysisItem[];
    
    if (editingIndex !== null) {
      // Update existing item
      updatedData = [...postCallData];
      updatedData[editingIndex] = item;
    } else {
      // Add new item
      updatedData = [...postCallData, item];
    }
    
    updateAgentField('post_call_analysis_data', updatedData);
    handleCloseModal();
  };
  
  const handleDeleteItem = (index: number) => {
    const updatedData = postCallData.filter((_, i) => i !== index);
    updateAgentField('post_call_analysis_data', updatedData);
  };
  
  const handleModelChange = (model: string) => {
    updateAgentField('post_call_analysis_model', model);
  };

  return (
    <AccordionItem value="post-call-analysis" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <BarChart3 className="h-4 w-4 mr-2" />
        {t('post_call_analysis')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-amber-600">Post Call Data Retrieval</Label>
            <p className="text-xs text-gray-500">Define the information that you need to extract from the call. (Learn more)</p>
          </div>

          <div className="space-y-2">
            {/* Data Retrieval Items */}
            {postCallData.map((item, index) => (
              <AnalysisItem
                key={`${item.name}-${index}`}
                item={item}
                index={index}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="relative">
              <AddFieldDropdown 
                isMenuOpen={isMenuOpen} 
                setIsMenuOpen={setIsMenuOpen} 
                onSelectField={handleOpenModal} 
              />
            </div>
            
            <div className="flex items-center">
              <ModelSelector 
                analysisModel={analysisModel} 
                onModelChange={handleModelChange}
              />
            </div>
          </div>

          {/* Modals for adding/editing fields */}
          {modalType === 'text' && (
            <TextFieldModal
              open={modalType === 'text'}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              type="text"
              existingItem={editingItem}
            />
          )}
          
          {modalType === 'number' && (
            <TextFieldModal
              open={modalType === 'number'}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              type="number"
              existingItem={editingItem}
            />
          )}
          
          {modalType === 'selector' && (
            <SelectorFieldModal
              open={modalType === 'selector'}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              type="selector"
              existingItem={editingItem}
            />
          )}
          
          {modalType === 'boolean' && (
            <BooleanFieldModal
              open={modalType === 'boolean'}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              type="boolean"
              existingItem={editingItem}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PostCallAnalysisSection;
