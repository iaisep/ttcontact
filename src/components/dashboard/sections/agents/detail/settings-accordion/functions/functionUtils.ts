
import { AgentFunction } from './types';

export const createFunctionFromTemplate = (type: string): AgentFunction => {
  const templates: Record<string, AgentFunction> = {
    custom: {
      name: '',
      description: '',
      type: 'custom',
      url: '',
      timeout_ms: 120000,
      speak_during_execution: false,
      speak_after_execution: false,
      parameters: {
        type: 'object',
        properties: {}
      }
    },
    end_call: {
      name: '',
      description: '',
      type: 'end_call'
    },
    transfer_call: {
      name: '',
      description: '',
      type: 'transfer_call',
      transfer_destination: {
        type: 'predefined',
        number: ''
      },
      show_transferee_as_caller: false
    },
    ivr_digit: {
      name: '',
      description: '',
      type: 'ivr',
      digit: '',
      pause_detection_delay_ms: 1000
    },
    calendar_book: {
      name: '',
      description: 'When users ask to book an appointment, book it on the calendar.',
      type: 'book_appointment_cal',
      event_type_id: 0,
      cal_api_key: '',
      timezone: 'America/Los_Angeles'
    },
    calendar_availability: {
      name: '',
      description: 'When users ask for availability, check the calendar and provide available slots.',
      type: 'check_availability_cal',
      event_type_id: 0,
      cal_api_key: '',
      timezone: 'America/Los_Angeles'
    }
  };

  return templates[type] || templates.custom;
};

export const formatFunctionName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_\-]/g, '_') // Replace invalid chars with underscores
    .slice(0, 64); // Max length 64
};

export const validateFunctionName = (name: string): boolean => {
  const regex = /^[a-zA-Z0-9_\-]{1,64}$/;
  return regex.test(name);
};

export const FUNCTION_TYPE_LABELS: Record<string, string> = {
  'custom': 'Custom Function',
  'end_call': 'End Call',
  'transfer_call': 'Transfer Call',
  'ivr': 'Press Digit (IVR)',
  'book_appointment_cal': 'Book Calendar',
  'check_availability_cal': 'Check Calendar Availability'
};

export const getFunctionTypeLabel = (type: string): string => {
  return FUNCTION_TYPE_LABELS[type] || type;
};
