
import { AgentFunction } from './types';

// Create a new function from template
export const createFunctionFromTemplate = (type: string): AgentFunction => {
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
