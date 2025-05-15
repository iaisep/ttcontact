
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Shield, Plus, Cog } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { AccordionSectionProps } from './types';

const SecurityFallbackSection: React.FC<AccordionSectionProps> = ({ agent }) => {
  const { t } = useLanguage();

  return (
    <AccordionItem value="security-fallback" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <Shield className="h-4 w-4 mr-2" />
        {t('Security fallback settings')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-6">
          {/* Opt Out Sensitive Data Storage */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Opt Out Sensitive Data Storage</Label>
            <p className="text-xs text-gray-500">Control whether Retell should store sensitive data. (Learn more)</p>
          </div>

          {/* Fallback Voice ID */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Fallback Voice ID</Label>
            <p className="text-xs text-gray-500">If the current voice provider fails, assign a fallback voice to continue the call.</p>
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>

          {/* Default Dynamic Variables */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Default Dynamic Variables</Label>
            <p className="text-xs text-gray-500">Set fallback values for dynamic variables across all endpoints if they are not provided.</p>
            <Button variant="outline" size="sm" className="text-xs">
              <Cog className="h-3 w-3 mr-1" /> Set Up
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SecurityFallbackSection;
