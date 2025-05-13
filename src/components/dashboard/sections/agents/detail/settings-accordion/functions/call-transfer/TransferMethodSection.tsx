
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';

interface TransferMethodSectionProps {
  transferMethod: string;
  setTransferMethod: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  dynamicRouting: string;
  setDynamicRouting: (value: string) => void;
}

const TransferMethodSection: React.FC<TransferMethodSectionProps> = ({
  transferMethod,
  setTransferMethod,
  phoneNumber,
  setPhoneNumber,
  dynamicRouting,
  setDynamicRouting
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
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
  );
};

export default TransferMethodSection;
