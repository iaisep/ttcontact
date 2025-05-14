
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BarChart3, Cog, Edit, Plus, Radio, Trash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';

const PostCallAnalysisSection: React.FC<AccordionSectionProps> = ({ agent }) => {
  const { t } = useLanguage();

  return (
    <AccordionItem value="post-call-analysis" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <BarChart3 className="h-4 w-4 mr-2" />
        {t('post_call_analysis')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-amber-600">Post Call Data Retrieval</Label>
            <p className="text-xs text-gray-500">Define the information that you need to extract from the call. (Learn more)</p>
          </div>

          <div className="space-y-2">
            {/* Data Retrieval Items */}
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
              <div className="flex items-center">
                <Radio className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Oportunidad</span>
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

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
            
            <div className="flex items-center space-x-2">
              <Cog className="h-4 w-4 text-gray-400" />
              <span className="text-xs">GPT-4o Mini</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PostCallAnalysisSection;
