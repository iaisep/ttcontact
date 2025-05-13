
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { Phone } from 'lucide-react';

interface CallTransferFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: RetellAgent;
  onSuccess?: () => void;
}

const CallTransferFunctionModal: React.FC<CallTransferFunctionModalProps> = ({
  isOpen,
  onClose,
  agent,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [functionName, setFunctionName] = useState('transfer_call');
  const [description, setDescription] = useState('Transfer the call to a human agent');
  const [transferMethod, setTransferMethod] = useState('static');
  const [phoneNumber, setPhoneNumber] = useState('+14154154155');
  const [dynamicRouting, setDynamicRouting] = useState(
    'If the user wants to reach support, transfer to +1 (925) 222-2222; if the user wants to reach sales, transfer to +1 (925) 333-3333'
  );
  const [transferType, setTransferType] = useState('cold');
  const [messageType, setMessageType] = useState('prompt');
  const [handoffMessage, setHandoffMessage] = useState('Say hello to the agent and summarize the user problem to him');

  const handleSubmit = async () => {
    if (!functionName.trim()) {
      toast.error(t('function_name_required'));
      return;
    }

    const llmId = agent?.response_engine?.llm_id;
    if (!llmId) {
      toast.error(t('no_llm_id_found'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the function data based on transfer method
      const transferDestination = transferMethod === 'static' 
        ? {
            type: "predefined",
            number: phoneNumber
          }
        : {
            type: "dynamic",
            routing_prompt: dynamicRouting
          };
          
      // Prepare handoff message configuration based on transfer type and message type
      const handoffConfig = transferType === 'warm' 
        ? {
            type: messageType === 'prompt' ? 'prompt' : 'static',
            content: handoffMessage
          }
        : undefined;

      // Create the function payload
      const functionData = {
        name: functionName,
        description: description,
        type: "transfer_call",
        transfer_destination: transferDestination,
        show_transferee_as_caller: false,
        ...(handoffConfig && { handoff_message: handoffConfig })
      };

      // Get existing functions first
      const llmResponse = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      const existingTools = llmResponse.general_tools || [];
      
      // Add the new function
      const updatedTools = [...existingTools, functionData];
      
      // Update the LLM with the new function
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ general_tools: updatedTools })
      });

      toast.success(t('call_transfer_function_added'));
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error adding call transfer function:', error);
      toast.error(t('error_adding_call_transfer_function'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {t('transfer_call')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              placeholder={t('function_name')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">
              {t('description')} <span className="text-xs text-muted-foreground">({t('optional')})</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('function_description')}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('transfer_to')}</Label>
            <Tabs defaultValue="static" value={transferMethod} onValueChange={setTransferMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="static">{t('static_number')}</TabsTrigger>
                <TabsTrigger value="dynamic">{t('dynamic_routing')}</TabsTrigger>
              </TabsList>
              <TabsContent value="static" className="pt-2">
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t('phone_number')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('enter_a_static_phone_number_or_dynamic_variable')}
                </p>
              </TabsContent>
              <TabsContent value="dynamic" className="pt-2">
                <Textarea
                  value={dynamicRouting}
                  onChange={(e) => setDynamicRouting(e.target.value)}
                  placeholder={t('dynamic_routing_instructions')}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('use_a_prompt_to_handle_dynamic_call_transfer_routing')}
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <Label>{t('type')}</Label>
            <RadioGroup 
              value={transferType} 
              onValueChange={setTransferType}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cold" id="cold" />
                <Label htmlFor="cold" className="cursor-pointer">{t('cold_transfer')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="warm" id="warm" />
                <Label htmlFor="warm" className="cursor-pointer">{t('warm_transfer')}</Label>
              </div>
            </RadioGroup>
          </div>
          
          {transferType === 'warm' && (
            <div className="space-y-2">
              <Label>{t('handoff_message')}</Label>
              <Tabs defaultValue="prompt" value={messageType} onValueChange={setMessageType} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="prompt">{t('prompt')}</TabsTrigger>
                  <TabsTrigger value="static">{t('static_sentence')}</TabsTrigger>
                </TabsList>
                <TabsContent value="prompt" className="pt-2">
                  <Textarea
                    value={handoffMessage}
                    onChange={(e) => setHandoffMessage(e.target.value)}
                    placeholder={t('handoff_prompt')}
                    rows={3}
                  />
                </TabsContent>
                <TabsContent value="static" className="pt-2">
                  <Textarea
                    value={handoffMessage}
                    onChange={(e) => setHandoffMessage(e.target.value)}
                    placeholder={t('enter_static_message')}
                    rows={3}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-black text-white hover:bg-gray-800"
          >
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallTransferFunctionModal;
