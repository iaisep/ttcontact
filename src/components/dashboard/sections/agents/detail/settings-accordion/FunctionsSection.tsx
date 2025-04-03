
import React, { useState, useEffect } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, FileText, Phone, Sparkles, Calendar, CornerDownRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { EditFunctionModal } from './function-modals/EditFunctionModal';
import { AddFunctionModal } from './function-modals/AddFunctionModal';
import { DeleteFunctionDialog } from './function-modals/DeleteFunctionDialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

// Type definitions for functions/tools
interface FunctionParameter {
  type: string;
  description: string;
  properties?: Record<string, any>;
  required?: string[];
}

export interface AgentFunction {
  name: string;
  description: string;
  type: string;
  timeout_ms?: number;
  speak_during_execution?: boolean;
  speak_after_execution?: boolean;
  parameters?: FunctionParameter;
  url?: string;
}

const FunctionsSection: React.FC<AccordionSectionProps> = ({ agent }) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [functions, setFunctions] = useState<AgentFunction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<AgentFunction | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const llmId = agent?.response_engine?.llm_id;

  // Fetch functions data
  const fetchFunctions = async () => {
    if (!llmId) return;
    
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      if (response && response.general_tools) {
        setFunctions(response.general_tools);
      }
    } catch (error) {
      console.error('Error fetching LLM functions:', error);
      toast.error(t('error_fetching_functions'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, [llmId]);

  // Function to update LLM with modified functions
  const updateLLMFunctions = async (updatedFunctions: AgentFunction[]) => {
    if (!llmId) return;
    
    setIsLoading(true);
    try {
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ general_tools: updatedFunctions })
      });
      
      setFunctions(updatedFunctions);
      toast.success(t('functions_updated_successfully'));
      return true;
    } catch (error) {
      console.error('Error updating LLM functions:', error);
      toast.error(t('error_updating_functions'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle function edit
  const handleEditFunction = (func: AgentFunction) => {
    setSelectedFunction(func);
    setEditModalOpen(true);
  };

  // Handle function delete 
  const handleDeleteFunction = (func: AgentFunction) => {
    setSelectedFunction(func);
    setDeleteDialogOpen(true);
  };
  
  // Perform function delete
  const confirmDeleteFunction = async () => {
    if (!selectedFunction) return;
    
    const updatedFunctions = functions.filter(f => f.name !== selectedFunction.name);
    const success = await updateLLMFunctions(updatedFunctions);
    
    if (success) {
      setDeleteDialogOpen(false);
      setSelectedFunction(null);
    }
  };

  // Handle function update
  const handleUpdateFunction = async (updatedFunction: AgentFunction) => {
    const updatedFunctions = functions.map(f => 
      f.name === selectedFunction?.name ? updatedFunction : f
    );
    
    const success = await updateLLMFunctions(updatedFunctions);
    if (success) {
      setEditModalOpen(false);
      setSelectedFunction(null);
    }
  };

  // Handle function add
  const handleAddFunction = async (newFunction: AgentFunction) => {
    const updatedFunctions = [...functions, newFunction];
    const success = await updateLLMFunctions(updatedFunctions);
    
    if (success) {
      setAddModalOpen(false);
    }
  };

  // Get the appropriate icon for a function
  const getFunctionIcon = (func: AgentFunction) => {
    switch (func.type) {
      case 'end_call':
        return <Phone className="h-4 w-4 mr-2 text-gray-500" />;
      case 'custom':
        return <Sparkles className="h-4 w-4 mr-2 text-amber-500" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 mr-2 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  // Create a new function from template
  const createFunctionFromTemplate = (type: string) => {
    switch (type) {
      case 'end_call':
        return {
          name: 'end_call',
          type: 'end_call',
          description: 'End the call immediately'
        };
      case 'call_transfer':
        return {
          name: 'call_transfer',
          type: 'custom',
          description: 'Transfer call to another agent or human',
          timeout_ms: 30000,
          speak_during_execution: true,
          speak_after_execution: false,
          parameters: {
            type: 'object',
            description: 'Call transfer parameters',
            properties: {
              transfer_to: {
                type: 'string',
                description: 'ID or phone number to transfer to'
              }
            },
            required: ['transfer_to']
          },
          url: ''
        };
      case 'calendar_check':
        return {
          name: 'check_availability',
          type: 'custom',
          description: 'Check calendar availability',
          timeout_ms: 60000,
          speak_during_execution: true,
          speak_after_execution: true,
          parameters: {
            type: 'object',
            description: 'Calendar parameters',
            properties: {
              date: {
                type: 'string',
                description: 'Date to check in ISO format'
              }
            },
            required: ['date']
          },
          url: ''
        };
      case 'calendar_book':
        return {
          name: 'book_appointment',
          type: 'custom',
          description: 'Book an appointment on the calendar',
          timeout_ms: 60000,
          speak_during_execution: true,
          speak_after_execution: true,
          parameters: {
            type: 'object',
            description: 'Booking parameters',
            properties: {
              date: {
                type: 'string',
                description: 'Date and time in ISO format'
              },
              duration: {
                type: 'number',
                description: 'Duration in minutes'
              }
            },
            required: ['date', 'duration']
          },
          url: ''
        };
      case 'ivr_digit':
        return {
          name: 'press_digit',
          type: 'custom',
          description: 'Press a digit for IVR navigation',
          timeout_ms: 10000,
          speak_during_execution: false,
          speak_after_execution: true,
          parameters: {
            type: 'object',
            description: 'IVR parameters',
            properties: {
              digit: {
                type: 'string',
                description: 'Digit to press (0-9, *, #)'
              }
            },
            required: ['digit']
          },
          url: ''
        };
      default:
        return {
          name: 'custom_function',
          type: 'custom',
          description: 'Custom function',
          timeout_ms: 30000,
          speak_during_execution: false,
          speak_after_execution: true,
          parameters: {
            type: 'object',
            description: 'Function parameters',
            properties: {},
            required: []
          },
          url: ''
        };
    }
  };

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
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    {getFunctionIcon(func)}
                    <span className="text-sm">{func.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => handleEditFunction(func)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => handleDeleteFunction(func)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <PlusCircle className="h-3 w-3 mr-1" /> Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleAddFunctionTemplate('end_call')}>
                  <Phone className="mr-2 h-4 w-4" />
                  <span>End Call</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddFunctionTemplate('call_transfer')}>
                  <CornerDownRight className="mr-2 h-4 w-4" />
                  <span>Call Transfer</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddFunctionTemplate('calendar_check')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Check Calendar Availability</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddFunctionTemplate('calendar_book')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Book on the Calendar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddFunctionTemplate('ivr_digit')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Press Digit (IVR Navigation)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddFunctionTemplate('custom')}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Custom Function</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
