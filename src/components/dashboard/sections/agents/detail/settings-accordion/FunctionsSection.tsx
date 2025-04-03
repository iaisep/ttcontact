
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Edit, FileText, Plus, Radio, Trash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';

const FunctionsSection: React.FC<AccordionSectionProps> = ({ agent }) => {
  const { t } = useLanguage();

  return (
    <AccordionItem value="functions" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <FileText className="h-4 w-4 mr-2" />
        {t('functions')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-4">
          <p className="text-xs text-blue-600">
            Enable your agent with capabilities such as calendar bookings, call termination, etc.
          </p>

          <div className="space-y-2">
            {/* Function Items */}
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
              <div className="flex items-center">
                <Radio className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">correo</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
              <div className="flex items-center">
                <Radio className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">end_call</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
              <div className="flex items-center">
                <Radio className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">agendar</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FunctionsSection;
