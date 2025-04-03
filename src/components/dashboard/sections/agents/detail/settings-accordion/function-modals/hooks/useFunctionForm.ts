
import { useState, useEffect, useCallback } from 'react';
import { AgentFunction } from '../../functions/types';
import { FunctionFormData, FunctionFormErrors } from '../types';

const defaultFormData: FunctionFormData = {
  name: '',
  description: '',
  url: '',
  timeoutMs: '30000',
  parameters: '{}',
  speakDuring: false,
  speakAfter: true,
  type: 'custom'
};

export const useFunctionForm = (functionData: AgentFunction | null, isOpen?: boolean) => {
  const [formData, setFormData] = useState<FunctionFormData>(defaultFormData);
  const [errors, setErrors] = useState<FunctionFormErrors>({});
  
  // Reset form to default state or initialize with functionData
  const resetForm = useCallback(() => {
    if (functionData) {
      setFormData({
        name: functionData.name || '',
        description: functionData.description || '',
        url: functionData.url || '',
        type: functionData.type || 'custom',
        timeoutMs: functionData.timeout_ms?.toString() || '30000',
        speakDuring: functionData.speak_during_execution || false,
        speakAfter: functionData.speak_after_execution || true,
        parameters: functionData.parameters 
          ? JSON.stringify(functionData.parameters, null, 2) 
          : '{}'
      });
    } else {
      setFormData(defaultFormData);
    }
    
    // Clear errors when resetting
    setErrors({});
  }, [functionData]);
  
  // Initialize form data when component mounts or functionData changes
  useEffect(() => {
    resetForm();
  }, [functionData, resetForm]);
  
  // Handle form field changes
  const handleChange = useCallback((field: keyof FunctionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  // Validate form fields
  const validate = useCallback((): boolean => {
    const newErrors: FunctionFormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Function name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.type === 'custom' && !formData.url.trim()) {
      newErrors.url = 'URL is required for custom functions';
    }
    
    try {
      if (formData.parameters) {
        JSON.parse(formData.parameters);
      }
    } catch (e) {
      newErrors.parameters = 'Invalid JSON format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  // Build AgentFunction object from form data
  const buildFunctionObject = useCallback((): AgentFunction => {
    let parsedParameters;
    try {
      parsedParameters = formData.parameters ? JSON.parse(formData.parameters) : undefined;
    } catch (e) {
      parsedParameters = {};
    }
    
    const newFunction: AgentFunction = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
    };
    
    if (formData.type === 'custom') {
      newFunction.url = formData.url;
      newFunction.timeout_ms = parseInt(formData.timeoutMs, 10);
      newFunction.parameters = parsedParameters;
      newFunction.speak_during_execution = formData.speakDuring;
      newFunction.speak_after_execution = formData.speakAfter;
    }
    
    return newFunction;
  }, [formData]);
  
  return {
    formData,
    errors,
    handleChange,
    validate,
    buildFunctionObject,
    isCustomFunction: formData.type === 'custom',
    resetForm
  };
};
