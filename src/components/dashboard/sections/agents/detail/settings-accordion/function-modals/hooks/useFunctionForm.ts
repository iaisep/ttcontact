
import { useState, useEffect } from 'react';
import { AgentFunction } from '../../functions/types';

interface FunctionFormData {
  name: string;
  description: string;
  url: string;
  timeoutMs: string;
  parameters: string;
  speakDuring: boolean;
  speakAfter: boolean;
  executionMessage?: string;
  // For other function types
  digit?: string;
  transfer_destination?: {
    type: string;
    number?: string;
  };
  event_type_id?: number;
  cal_api_key?: string;
  timezone?: string;
}

interface FunctionFormErrors {
  name?: string;
  description?: string;
  url?: string;
  parameters?: string;
  digit?: string;
}

export const useFunctionForm = (initialData: AgentFunction | null, isOpen: boolean) => {
  const [formData, setFormData] = useState<FunctionFormData>({
    name: '',
    description: '',
    url: '',
    timeoutMs: '120000', // Default timeout
    parameters: '{\n  "type": "object",\n  "properties": {}\n}',
    speakDuring: false,
    speakAfter: false,
    executionMessage: '',
  });

  const [errors, setErrors] = useState<FunctionFormErrors>({});
  const [isCustomFunction, setIsCustomFunction] = useState(true);

  // Reset form when modal is opened with new data
  useEffect(() => {
    if (isOpen && initialData) {
      setIsCustomFunction(initialData.type === 'custom');
      
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        url: initialData.url || '',
        timeoutMs: initialData.timeout_ms ? initialData.timeout_ms.toString() : '120000',
        parameters: initialData.parameters ? JSON.stringify(initialData.parameters, null, 2) : '{\n  "type": "object",\n  "properties": {}\n}',
        speakDuring: initialData.speak_during_execution || false,
        speakAfter: initialData.speak_after_execution || false,
        executionMessage: initialData.execution_message || '',
        digit: initialData.digit || '',
        transfer_destination: initialData.transfer_destination,
        event_type_id: initialData.event_type_id,
        cal_api_key: initialData.cal_api_key,
        timezone: initialData.timezone,
      });
      
      setErrors({});
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      url: '',
      timeoutMs: '120000',
      parameters: '{\n  "type": "object",\n  "properties": {}\n}',
      speakDuring: false,
      speakAfter: false,
      executionMessage: '',
    });
    setErrors({});
    setIsCustomFunction(true);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors for the field being changed
    if (errors[field as keyof FunctionFormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FunctionFormErrors];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FunctionFormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Got invalid tool name: "", Tool name must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.';
    }
    
    if (isCustomFunction && !formData.url.trim()) {
      newErrors.url = 'Got empty url';
    }
    
    if (isCustomFunction && formData.parameters) {
      try {
        JSON.parse(formData.parameters);
      } catch (e) {
        newErrors.parameters = 'Invalid JSON format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildFunctionObject = (): AgentFunction => {
    const baseFunction = {
      name: formData.name,
      description: formData.description,
      type: 'custom',
    };

    if (isCustomFunction) {
      return {
        ...baseFunction,
        url: formData.url,
        timeout_ms: parseInt(formData.timeoutMs),
        speak_during_execution: formData.speakDuring,
        speak_after_execution: formData.speakAfter,
        ...(formData.speakDuring && formData.executionMessage ? { execution_message: formData.executionMessage } : {}),
        ...(formData.parameters ? { parameters: JSON.parse(formData.parameters) } : {}),
      };
    }
    
    // This is for non-custom functions
    return {
      ...baseFunction,
      // Add other function-specific fields based on type
      ...(formData.digit ? { digit: formData.digit } : {}),
      ...(formData.transfer_destination ? { transfer_destination: formData.transfer_destination } : {}),
      ...(formData.event_type_id ? { event_type_id: formData.event_type_id } : {}),
      ...(formData.cal_api_key ? { cal_api_key: formData.cal_api_key } : {}),
      ...(formData.timezone ? { timezone: formData.timezone } : {}),
    };
  };

  return {
    formData,
    errors,
    handleChange,
    validate,
    buildFunctionObject,
    isCustomFunction,
    resetForm,
  };
};
