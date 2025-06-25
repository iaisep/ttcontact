import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface WhatsAppInboxFormProps {
  onBack: () => void;
  onComplete: () => void;
}

interface FormData {
  apiProvider: string;
  inboxName: string;
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  apiKey: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
}

const WhatsAppInboxForm: React.FC<WhatsAppInboxFormProps> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    apiProvider: 'WhatsApp Cloud',
    inboxName: '',
    phoneNumber: '',
    phoneNumberId: '',
    businessAccountId: '',
    apiKey: ''
  });
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock agents data (esto debería venir de una API)
  const agents: Agent[] = [
    { id: '1', name: 'Agent Smith', email: 'smith@company.com' },
    { id: '2', name: 'Agent Johnson', email: 'johnson@company.com' },
    { id: '3', name: 'Agent Brown', email: 'brown@company.com' }
  ];

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.inboxName.trim()) {
      newErrors.inboxName = 'Please enter a valid inbox name';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    } else if (!formData.phoneNumber.startsWith('+')) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    } else if (formData.phoneNumber.includes(' ')) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    } else if (formData.phoneNumber.length < 8 || formData.phoneNumber.length > 15) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    } else if (!/^\+\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    }

    if (!formData.phoneNumberId.trim()) {
      newErrors.phoneNumberId = 'Please enter a valid value.';
    }

    if (!formData.businessAccountId.trim()) {
      newErrors.businessAccountId = 'Please enter a valid value.';
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'Please enter a valid value.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Special handling for phone number to auto-add + if missing and allow only numbers
    if (field === 'phoneNumber') {
      // Remove any spaces and non-numeric characters (except + at the beginning)
      value = value.replace(/\s/g, '');
      
      // If user starts typing without +, add it automatically
      if (value && !value.startsWith('+')) {
        value = '+' + value;
      }
      
      // Validate that after the + sign, only numbers are allowed
      if (value.length > 1) {
        const numbersOnly = value.slice(1).replace(/\D/g, ''); // Remove non-digits after +
        value = '+' + numbersOnly;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleCreateWhatsAppChannel = async () => {
    setIsCreating(true);
    try {
      // Aquí iría la llamada a la API para crear el inbox
      console.log('Creating WhatsApp inbox:', { formData, selectedAgents });
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the new inbox to the ChatInboxSection
      if ((window as any).addNewInbox) {
        (window as any).addNewInbox({
          name: formData.inboxName,
          platform: 'WhatsApp',
          phoneNumber: formData.phoneNumber
        });
      }
      
      // Redirigir a la vista de inboxes
      onComplete();
    } catch (error) {
      console.error('Error creating WhatsApp inbox:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">WhatsApp Channel</h2>
        <p className="text-gray-600 mb-6">Start supporting your customers via WhatsApp.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="apiProvider">API Provider</Label>
          <Select value={formData.apiProvider} onValueChange={(value) => handleInputChange('apiProvider', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WhatsApp Cloud">WhatsApp Cloud</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="inboxName">Inbox Name</Label>
          <Input
            id="inboxName"
            value={formData.inboxName}
            onChange={(e) => handleInputChange('inboxName', e.target.value)}
            placeholder="Please enter an inbox name"
            className={errors.inboxName ? 'border-red-500' : ''}
          />
          {errors.inboxName && (
            <p className="text-red-500 text-sm mt-1">{errors.inboxName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="Please enter the phone number from which message will be sent."
            className={errors.phoneNumber ? 'border-red-500' : ''}
            maxLength={15}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Please enter the phone number from which message will be sent. Only numbers allowed after the + sign.
          </p>
        </div>

        <div>
          <Label htmlFor="phoneNumberId">Phone number ID</Label>
          <Input
            id="phoneNumberId"
            value={formData.phoneNumberId}
            onChange={(e) => handleInputChange('phoneNumberId', e.target.value)}
            placeholder="Please enter the Phone number ID obtained from Facebook developer dashboard."
            className={errors.phoneNumberId ? 'border-red-500' : ''}
          />
          {errors.phoneNumberId && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumberId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="businessAccountId">Business Account ID</Label>
          <Input
            id="businessAccountId"
            value={formData.businessAccountId}
            onChange={(e) => handleInputChange('businessAccountId', e.target.value)}
            placeholder="Please enter the Business Account ID obtained from Facebook developer dashboard."
            className={errors.businessAccountId ? 'border-red-500' : ''}
          />
          {errors.businessAccountId && (
            <p className="text-red-500 text-sm mt-1">{errors.businessAccountId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="apiKey">API key</Label>
          <Input
            id="apiKey"
            value={formData.apiKey}
            onChange={(e) => handleInputChange('apiKey', e.target.value)}
            placeholder="API key"
            className={errors.apiKey ? 'border-red-500' : ''}
          />
          {errors.apiKey && (
            <p className="text-red-500 text-sm mt-1">{errors.apiKey}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNextStep}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create WhatsApp Channel
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Agents</h2>
        <p className="text-gray-600 mb-4">
          Here you can add agents to manage your newly created inbox. Only these selected agents will have access to your inbox. 
          Agents which are not part of this inbox will not be able to see or respond to messages in this inbox when they login.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          <strong>PS:</strong> As an administrator, if you need access to all inboxes, you should add yourself as agent to all inboxes that you create.
        </p>
      </div>

      <div>
        <Label>Agents</Label>
        <Select 
          value={selectedAgents.length > 0 ? selectedAgents[0] : ''} 
          onValueChange={(value) => setSelectedAgents([value])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pick agents for the inbox" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNextStep}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={selectedAgents.length === 0}
        >
          Add agents
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-2">Voilà!</h2>
        <p className="text-gray-600 mb-6">
          You are all set to go! Your WhatsApp inbox has been created successfully.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Inbox Details:</h3>
        <p><strong>Name:</strong> {formData.inboxName}</p>
        <p><strong>Phone:</strong> {formData.phoneNumber}</p>
        <p><strong>Agents:</strong> {selectedAgents.length} assigned</p>
      </div>

      <Button 
        onClick={handleCreateWhatsAppChannel}
        className="bg-blue-600 hover:bg-blue-700"
        disabled={isCreating}
      >
        {isCreating ? 'Creating Inbox...' : 'Go to Inboxes'}
      </Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Steps indicator */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
            <span className="ml-2 text-green-600">Choose Channel</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <span className={`ml-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Create Inbox</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
            <span className={`ml-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>Add Agents</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              4
            </div>
            <span className={`ml-2 ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-500'}`}>Voilà!</span>
          </div>
        </div>
      </div>

      {/* Content based on current step */}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
    </div>
  );
};

export default WhatsAppInboxForm;
