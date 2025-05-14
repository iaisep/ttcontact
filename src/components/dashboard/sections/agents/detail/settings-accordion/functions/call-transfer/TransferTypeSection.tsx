
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';

interface TransferTypeSectionProps {
  transferType: string;
  setTransferType: (value: string) => void;
  messageType: string;
  setMessageType: (value: string) => void;
  handoffMessage: string;
  setHandoffMessage: (value: string) => void;
}

const TransferTypeSection: React.FC<TransferTypeSectionProps> = ({
  transferType,
  setTransferType,
  messageType,
  setMessageType,
  handoffMessage,
  setHandoffMessage
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
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
  );
};

export default TransferTypeSection;
