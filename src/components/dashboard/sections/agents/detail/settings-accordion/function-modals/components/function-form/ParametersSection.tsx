
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useJsonFormatter } from './hooks/useJsonFormatter';

interface ParametersSectionProps {
  parameters: string;
  parametersError?: string;
  onChange: (field: string, value: string) => void;
}

const ParametersSection: React.FC<ParametersSectionProps> = ({
  parameters,
  parametersError,
  onChange
}) => {
  const { 
    jsonError, 
    handleFormatJSON, 
    setExampleJSON 
  } = useJsonFormatter(parameters, (formatted) => onChange('parameters', formatted));

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="parameters" className="text-right pt-2">Parameters (JSON)</Label>
      <div className="col-span-3 space-y-2">
        <Textarea
          id="parameters"
          value={parameters}
          onChange={(e) => onChange('parameters', e.target.value)}
          className="font-mono text-xs"
          rows={8}
          placeholder='{\n  "type": "object",\n  "properties": {}\n}'
        />
        {(parametersError || jsonError) && (
          <p className="text-red-500 text-xs">{parametersError || jsonError}</p>
        )}
        <div className="flex gap-2 flex-wrap">
          <Button 
            type="button" 
            size="sm" 
            variant="secondary" 
            onClick={() => setExampleJSON(1)}
          >
            example 1
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="secondary" 
            onClick={() => setExampleJSON(2)}
          >
            example 2
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="secondary" 
            onClick={() => setExampleJSON(3)}
          >
            example 3
          </Button>
        </div>
        <Button 
          type="button" 
          className="w-full" 
          variant="outline" 
          onClick={handleFormatJSON}
        >
          Format JSON
        </Button>
      </div>
    </div>
  );
};

export default ParametersSection;
