
import React, { useState } from 'react';
import { Edit, Trash2, Phone, Sparkles, Calendar, FileText } from 'lucide-react';
import { AgentFunction, FunctionItemProps } from './types';
import EndCallFunctionModal from './end-call/EndCallFunctionModal';
import CallTransferFunctionModal from './call-transfer/CallTransferFunctionModal';
import BookCalendarModal from './book-calendar/BookCalendarModal';
import CalendarAvailabilityModal from './calendar-availability/CalendarAvailabilityModal';
import PressDigitFunctionModal from './press-digit/PressDigitFunctionModal';

export const FunctionItem: React.FC<FunctionItemProps> = ({ func, onEdit, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // Handler for edit button
  const handleEditClick = () => {
    // For special function types, show the specific modal
    if (['transfer_call', 'end_call', 'calendar_availability', 'book_calendar', 'press_digit', 'book_appointment_cal', 'check_calendar_availability'].includes(func.type)) {
      setShowEditModal(true);
    } else {
      // For other function types, use the default edit handler
      onEdit(func);
    }
  };

  // Handler for when a specialized edit completes
  const handleSpecializedEditSuccess = () => {
    setShowEditModal(false);
  };

  // Create a mock agent object that satisfies the RetellAgent type requirements
  const mockAgent = {
    agent_id: func.id || 'temp-agent-id',
    agent_name: func.name,
    voice_id: "",
    last_modification_timestamp: new Date().getTime(),
    response_engine: { type: "llm", llm_id: func.id || "" }
  };

  return (
    <>
      <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
        <div className="flex items-center">
          {getFunctionIcon(func)}
          <span className="text-sm">{func.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={() => onDelete(func)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Specialized Edit Modals */}
      {showEditModal && func.type === 'end_call' && (
        <EndCallFunctionModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          agent={mockAgent}
          onSuccess={handleSpecializedEditSuccess}
          initialData={func} // Pass the function data for editing
        />
      )}

      {showEditModal && func.type === 'transfer_call' && (
        <CallTransferFunctionModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          agent={mockAgent}
          onSuccess={handleSpecializedEditSuccess}
          initialData={func} // Pass the function data for editing
        />
      )}

      {showEditModal && (func.type === 'calendar_availability' || func.type === 'check_availability_cal' || func.type === 'check_calendar_availability') && (
        <CalendarAvailabilityModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          agent={mockAgent}
          onSuccess={handleSpecializedEditSuccess}
          initialData={func} // Pass the function data for editing
        />
      )}

      {showEditModal && (func.type === 'book_calendar' || func.type === 'book_appointment_cal') && (
        <BookCalendarModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          agent={mockAgent}
          onSuccess={handleSpecializedEditSuccess}
          initialData={func} // Pass the function data for editing
        />
      )}

      {showEditModal && func.type === 'press_digit' && (
        <PressDigitFunctionModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          agent={mockAgent}
          onSuccess={handleSpecializedEditSuccess}
          initialData={func} // Pass the function data for editing
        />
      )}
    </>
  );
};

// Helper function to get the appropriate icon for a function
export const getFunctionIcon = (func: AgentFunction) => {
  switch (func.type) {
    case 'end_call':
    case 'press_digit':
      return <Phone className="h-4 w-4 mr-2 text-gray-500" />;
    case 'custom':
      return <Sparkles className="h-4 w-4 mr-2 text-amber-500" />;
    case 'calendar':
    case 'book_calendar':
    case 'calendar_availability':
    case 'book_appointment_cal':
    case 'check_calendar_availability':
    case 'check_availability_cal':
      return <Calendar className="h-4 w-4 mr-2 text-blue-500" />;
    default:
      return <FileText className="h-4 w-4 mr-2 text-gray-500" />;
  }
};

export default FunctionItem;
