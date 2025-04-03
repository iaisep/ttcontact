
import { AgentFunction } from "./types";

/**
 * Creates a function template based on the specified type
 */
export const createFunctionFromTemplate = (type: string): AgentFunction => {
  switch (type) {
    case 'call_transfer':
      return {
        name: '',
        description: 'Transfer call to another agent or phone number',
        type: 'custom',
        url: 'https://api.example.com/transfer',
        parameters: {
          type: 'object',
          description: 'Parameters for call transfer',
          properties: {
            destination: {
              type: 'string',
              description: 'Phone number or agent ID to transfer to'
            },
            reason: {
              type: 'string',
              description: 'Reason for transfer'
            }
          },
          required: ['destination']
        },
        timeout_ms: 30000,
        speak_during_execution: true,
        speak_after_execution: false
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
        speak_after_execution: true
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
