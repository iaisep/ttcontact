
import { AgentFunction } from "./types";

/**
 * Creates a function template based on the specified type
 */
export const createFunctionFromTemplate = (type: string): AgentFunction => {
  switch (type) {
    case 'call_transfer':
      return {
        name: 'transfer_call',
        description: 'Transfer the call to a human agent',
        type: 'transfer_call',
        transfer_destination: {
          type: 'predefined',
          number: '+14154154155'
        },
        show_transferee_as_caller: false
      };
      
    case 'calendar_booking':
      return {
        name: '',
        description: 'Book an appointment on a calendar',
        type: 'custom',
        url: 'https://api.example.com/calendar/book',
        parameters: {
          type: 'object',
          description: 'Parameters for calendar booking',
          properties: {
            date: {
              type: 'string',
              description: 'Date for the appointment (YYYY-MM-DD)'
            },
            time: {
              type: 'string',
              description: 'Time for the appointment (HH:MM)'
            },
            duration: {
              type: 'number',
              description: 'Duration in minutes'
            },
            title: {
              type: 'string',
              description: 'Title of the appointment'
            }
          },
          required: ['date', 'time', 'title']
        },
        timeout_ms: 30000,
        speak_during_execution: true,
        speak_after_execution: true,
        execution_message: 'Let me check our calendar for availability.'
      };
      
    case 'end_call':
      return {
        name: 'end_call',
        description: 'End the current call',
        type: 'end_call'
      };
      
    default:
      return {
        name: '',
        description: '',
        type: 'custom',
        url: '',
        parameters: {
          type: 'object',
          description: 'Function parameters'
        },
        timeout_ms: 30000,
        speak_during_execution: false,
        speak_after_execution: true
      };
  }
};
