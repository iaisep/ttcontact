
import { useState } from 'react';

export const useJsonFormatter = (
  jsonString: string, 
  onFormat: (formatted: string) => void
) => {
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleFormatJSON = () => {
    try {
      if (!jsonString.trim()) return;
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      onFormat(formatted);
      setJsonError(null);
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  const setExampleJSON = (example: number) => {
    let jsonData = '';
    
    switch (example) {
      case 1:
        jsonData = JSON.stringify({
          type: "object",
          properties: {
            appointment_available_ts: {
              type: "string",
              description: "The timestamp of the appointment that is available for booking."
            }
          },
          required: ["appointment_available_ts"]
        }, null, 2);
        break;
      case 2:
        jsonData = JSON.stringify({
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "The city for which the weather is to be fetched."
            }
          },
          required: ["city"]
        }, null, 2);
        break;
      case 3:
        jsonData = JSON.stringify({
          type: "object",
          properties: {
            appointment_available_ts: {
              type: "string",
              description: "The timestamp of the appointment that is available for booking."
            },
            doctor_name: {
              type: "string",
              description: "An optional field to specify the name of the doctor."
            }
          },
          required: ["appointment_available_ts"]
        }, null, 2);
        break;
    }
    
    onFormat(jsonData);
    setJsonError(null);
  };

  return {
    jsonError,
    handleFormatJSON,
    setExampleJSON
  };
};
