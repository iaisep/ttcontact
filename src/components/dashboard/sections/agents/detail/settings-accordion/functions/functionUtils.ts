
import { AgentFunction } from './types';

export const createFunctionFromTemplate = (type: string): AgentFunction => {
  switch (type) {
    case 'end_call':
      return {
        name: 'end_call',
        type: 'end_call',
        description: 'End the call when the conversation is complete.'
      };
    
    case 'calendar_book':
      return {
        name: 'book_appointment',
        type: 'book_appointment_cal',
        description: 'When users ask to book an appointment, book it on the calendar.',
        event_type_id: 0,
        cal_api_key: '',
        timezone: 'America/Los_Angeles'
      };
      
    case 'calendar_availability':
      return {
        name: 'check_calendar_availability',
        type: 'check_availability_cal',
        description: 'When users ask for availability, check the calendar and provide available slots.',
        event_type_id: 0,
        cal_api_key: '',
        timezone: 'America/Los_Angeles'
      };
    
    case 'transfer_call':
      return {
        name: 'transfer_call',
        type: 'transfer_call',
        description: 'Transfer the call to another agent or phone number.',
        transfer_destination: {
          type: 'predefined',
          number: ''
        },
        show_transferee_as_caller: false
      };
    
    case 'ivr_digit':
      return {
        name: 'press_digit',
        type: 'press_digit',
        description: 'Press a digit for IVR navigation.',
        digit: '',
        pause_detection_delay_ms: 1000
      };
      
    case 'custom':
    default:
      return {
        name: 'custom_function',
        type: 'api',
        description: 'Custom function to execute API calls.',
        url: '',
        parameters: {
          type: 'object',
          description: 'Parameters for the custom function',
          properties: {},
          required: []
        },
        timeout_ms: 10000
      };
  }
};
