
import React from 'react';
import { FunctionFormProps } from '../../types';
import BasicInfoSection from './BasicInfoSection';
import ParametersSection from './ParametersSection';
import CustomFunctionSettings from './CustomFunctionSettings';

const FunctionForm: React.FC<FunctionFormProps> = ({ 
  formData, 
  errors, 
  onChange, 
  isCustomFunction 
}) => {
  return (
    <div className="grid gap-4 py-4">
      <BasicInfoSection 
        name={formData.name}
        description={formData.description}
        errors={errors}
        onChange={onChange}
      />
      
      {isCustomFunction && (
        <>
          <CustomFunctionSettings 
            url={formData.url}
            timeoutMs={formData.timeoutMs}
            speakDuring={formData.speakDuring}
            speakAfter={formData.speakAfter}
            executionMessage={formData.executionMessage}
            errors={errors}
            onChange={onChange}
          />
          
          <ParametersSection 
            parameters={formData.parameters}
            parametersError={errors.parameters}
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
};

export default FunctionForm;
