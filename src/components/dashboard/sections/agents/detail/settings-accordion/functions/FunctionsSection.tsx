
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { FunctionsSectionProps } from './types';
import { EditFunctionModal } from '../function-modals/EditFunctionModal';
import { AddFunctionModal } from '../function-modals/AddFunctionModal';
import { DeleteFunctionDialog } from '../function-modals/DeleteFunctionDialog';
import { useFunctions } from './useFunctions';
import { FunctionItem } from './FunctionItem';
import { AddFunctionDropdown } from './AddFunctionDropdown';
import { createFunctionFromTemplate } from './functionUtils';

const FunctionsSection: React.FC<FunctionsSectionProps> = ({ agent }) => {
  const { t } = useLanguage();
  const { 
    functions,
    isLoading,
    selectedFunction,
    editModalOpen,
    addModalOpen,
    deleteDialogOpen,
    setEditModalOpen,
    setAddModalOpen,
    setDeleteDialogOpen,
    setSelectedFunction,
    handleEditFunction,
    handleDeleteFunction,
    handleUpdateFunction,
    handleAddFunction,
    confirmDeleteFunction
  } = useFunctions(agent);

  // Handle adding a function from template
  const handleAddFunctionTemplate = (type: string) => {
    if (type === 'custom') {
      // For custom function, open the add modal with empty template
      setSelectedFunction(createFunctionFromTemplate(type));
      setAddModalOpen(true);
    } else {
      // For other function types, prepare the template and confirm
      const newFunction = createFunctionFromTemplate(type);
      setSelectedFunction(newFunction);
      
      // If it's a simple function like end_call, add it directly
      if (type === 'end_call') {
        handleAddFunction(newFunction);
      } else {
        // For other templates, open the editor
        setAddModalOpen(true);
      }
    }
  };

  return (
    <AccordionItem value="functions" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <FileText className="h-4 w-4 mr-2" />
        {t('functions')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-4">
          <p className="text-xs text-blue-600">
            Enable your agent with capabilities such as calendar bookings, call termination, etc.
          </p>

          <div className="space-y-2">
            {/* Function Items */}
            {isLoading ? (
              <div className="py-4 text-center text-sm text-gray-500">Loading functions...</div>
            ) : functions.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">No functions configured</div>
            ) : (
              functions.map((func, index) => (
                <FunctionItem 
                  key={index}
                  func={func}
                  onEdit={handleEditFunction}
                  onDelete={handleDeleteFunction}
                />
              ))
            )}
          </div>

          <div className="flex justify-end">
            <AddFunctionDropdown onAddTemplate={handleAddFunctionTemplate} />
          </div>
        </div>

        {/* Edit Function Modal */}
        <EditFunctionModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedFunction(null);
          }}
          onUpdate={handleUpdateFunction}
          functionData={selectedFunction}
        />

        {/* Add Function Modal */}
        <AddFunctionModal
          isOpen={addModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            setSelectedFunction(null);
          }}
          onAdd={handleAddFunction}
          functionData={selectedFunction}
        />

        {/* Delete Function Dialog */}
        <DeleteFunctionDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedFunction(null);
          }}
          onConfirm={confirmDeleteFunction}
          functionName={selectedFunction?.name || ''}
        />
      </AccordionContent>
    </AccordionItem>
  );
};

export default FunctionsSection;
