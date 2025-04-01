
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface LlmSelectorProps {
  llmId: string | undefined;
  selectedModel: string;
  onLlmChange: (llmId: string) => void;
  onSettingsClick: () => void;
}

// OpenAI LLM options
const LLM_OPTIONS = [
  { id: 'gpt-4o-mini', name: 'GPT 4o mini', provider: 'openai' },
  { id: 'gpt-4o', name: 'GPT 4o', provider: 'openai' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
];

const LlmSelector: React.FC<LlmSelectorProps> = ({ llmId, selectedModel, onLlmChange, onSettingsClick }) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLlmChange = async (newLlmId: string) => {
    if (newLlmId === selectedModel) return;
    
    setIsUpdating(true);
    try {
      // Ensure we have the current LLM ID from the agent
      const currentLlmId = llmId || '';
      
      // Update the LLM with the correct payload format
      await fetchWithAuth(`/update-retell-llm/${currentLlmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          model: newLlmId,
          s2s_model: null
        })
      });
      
      // Fetch the updated LLM info to get the latest model
      const updatedLlm = await fetchWithAuth(`/get-retell-llm/${currentLlmId}`);
      
      // Use the model from the response, fallback to selected if not found
      const updatedModel = updatedLlm?.model || newLlmId;
      
      // Call the onLlmChange callback with the updated model
      onLlmChange(updatedModel);
      
      toast.success(t('llm_updated_successfully'));
    } catch (error) {
      console.error('Error updating LLM:', error);
      toast.error(t('error_updating_llm'));
    } finally {
      setIsUpdating(false);
    }
  };

  // Find the current LLM details
  const currentLlm = LLM_OPTIONS.find(option => option.id === selectedModel) || { 
    id: selectedModel || '', 
    name: selectedModel || 'Select LLM', 
    provider: '' 
  };

  return (
    <div className="flex w-full max-w-full overflow-hidden">
      <Button 
        variant="outline" 
        className="flex items-center justify-between w-full max-w-full gap-1 sm:gap-2 bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 h-auto overflow-hidden"
      >
        <div className="flex items-center gap-1 sm:gap-2 overflow-hidden flex-wrap">
          <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="black" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 sm:h-4 sm:w-4">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>
          <span className="truncate text-xs sm:text-sm max-w-[100px] sm:max-w-[120px]">{currentLlm.name}</span>
        </div>
        <div className="flex items-center flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isUpdating}>
              <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="black" className="h-3 w-3 sm:h-4 sm:w-4">
                  <path d="M9.99956 10.879L13.7121 7.1665L14.7726 8.227L9.99956 13L5.22656 8.227L6.28706 7.1665L9.99956 10.879Z" fill="var(--icon-soft-400)"></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] z-50 bg-white">
              {LLM_OPTIONS.map((option) => (
                <DropdownMenuItem 
                  key={option.id}
                  onClick={() => handleLlmChange(option.id)}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="black" className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H16C18.2091 0 20 1.79086 20 4V16C20 18.2091 18.2091 20 16 20H4C1.79086 20 0 18.2091 0 16V4Z" fill="var(--bg-white-0)"></path>
                    <path d="M17.1673 9.73195C17.3321 10.0996 17.4367 10.4927 17.4795 10.8937C17.5207 11.2947 17.5001 11.7004 17.4145 12.095C17.3305 12.4897 17.1847 12.8685 16.9819 13.2171C16.8487 13.4501 16.6918 13.6688 16.5111 13.8701C16.332 14.0698 16.1323 14.2505 15.9152 14.409C15.6965 14.5675 15.4635 14.7006 15.2163 14.81C14.9706 14.9177 14.7139 15.0002 14.4508 15.054C14.3272 15.4376 14.1433 15.8005 13.9056 16.127C13.6694 16.4535 13.3826 16.7404 13.0561 16.9765C12.7296 17.2143 12.3682 17.3981 11.9847 17.5217C11.6011 17.6469 11.2001 17.7087 10.796 17.7087C10.5282 17.7103 10.2587 17.6818 9.99563 17.6279C9.73412 17.5724 9.47736 17.4884 9.23171 17.3791C8.98605 17.2697 8.75307 17.1334 8.53594 16.9749C8.32039 16.8164 8.12069 16.6342 7.94318 16.4329C7.54696 16.5185 7.14123 16.5391 6.74025 16.4979C6.33927 16.4551 5.94621 16.3505 5.57693 16.1857C5.20924 16.0224 4.86848 15.8005 4.56894 15.5295C4.26939 15.2585 4.01422 14.9415 3.81294 14.5928C3.67822 14.3599 3.56728 14.1142 3.48328 13.859C3.39928 13.6039 3.34381 13.3408 3.31528 13.0729C3.28676 12.8067 3.28834 12.5372 3.31687 12.2694C3.3454 12.0031 3.40404 11.74 3.48804 11.4849C3.2186 11.1853 2.99672 10.8446 2.83189 10.4769C2.66865 10.1076 2.56246 9.7161 2.52125 9.31513C2.47846 8.91415 2.50065 8.50841 2.58465 8.11377C2.66865 7.71913 2.81446 7.34034 3.01732 6.99167C3.15045 6.75869 3.30736 6.53838 3.48645 6.33869C3.66555 6.13899 3.86683 5.95831 4.08396 5.79982C4.30109 5.64133 4.53565 5.50662 4.78131 5.39884C5.02856 5.28949 5.28531 5.20866 5.5484 5.15477C5.67203 4.76964 5.85587 4.40828 6.09202 4.08179C6.32976 3.7553 6.61662 3.46844 6.94311 3.2307C7.2696 2.99455 7.63096 2.81071 8.0145 2.6855C8.39805 2.56188 8.79903 2.49848 9.20318 2.50007C9.47102 2.49848 9.74046 2.52542 10.0036 2.5809C10.2666 2.63637 10.5234 2.71878 10.7691 2.82814C11.0147 2.93908 11.2477 3.0738 11.4648 3.23229C11.682 3.39236 11.8817 3.57304 12.0592 3.77432C12.4538 3.69032 12.8595 3.66972 13.2605 3.71093C13.6615 3.75214 14.053 3.85832 14.4222 4.02157C14.7899 4.1864 15.1307 4.4067 15.4302 4.67772C15.7298 4.94715 15.985 5.26254 16.1862 5.6128C16.321 5.8442 16.4319 6.08986 16.5159 6.34661C16.5999 6.60178 16.6569 6.86487 16.6839 7.13272C16.7124 7.40057 16.7124 7.67 16.6823 7.93785C16.6538 8.2057 16.5951 8.46879 16.5111 8.72396C16.7822 9.0235 17.0025 9.36267 17.1673 9.73195ZM11.8864 16.4979C12.2319 16.3552 12.5457 16.1444 12.8104 15.8798C13.0751 15.6151 13.2859 15.3013 13.4285 14.9542C13.5712 14.6087 13.6456 14.2378 13.6456 13.8638V10.3295C13.6446 10.3263 13.6435 10.3226 13.6425 10.3184C13.6414 10.3152 13.6398 10.312 13.6377 10.3089C13.6356 10.3057 13.633 10.303 13.6298 10.3009C13.6266 10.2978 13.6235 10.2956 13.6203 10.2946L12.3413 9.55603V13.8257C12.3413 13.8685 12.3349 13.9129 12.3238 13.9541C12.3127 13.9969 12.2969 14.0365 12.2747 14.0746C12.2525 14.1126 12.2272 14.1475 12.1955 14.1776C12.1647 14.2083 12.13 14.2349 12.0924 14.2568L9.06371 16.005C9.03835 16.0208 8.99556 16.043 8.97337 16.0557C9.09857 16.1619 9.23488 16.2554 9.37752 16.3378C9.52174 16.4202 9.67072 16.49 9.82604 16.547C9.98136 16.6025 10.1414 16.6453 10.3031 16.6738C10.4663 16.7023 10.6312 16.7166 10.796 16.7166C11.17 16.7166 11.5409 16.6421 11.8864 16.4979ZM4.67354 14.0983C4.86214 14.4233 5.11097 14.7054 5.40735 14.9336C5.70531 15.1618 6.04289 15.3282 6.40425 15.4249C6.7656 15.5216 7.14281 15.5469 7.51368 15.4978C7.88454 15.4487 8.24114 15.3282 8.56605 15.1412L11.6281 13.374L11.636 13.3661C11.6381 13.364 11.6397 13.3608 11.6407 13.3566C11.6429 13.3534 11.6444 13.3503 11.6455 13.3471V11.8573L7.94952 13.9953C7.91149 14.0175 7.87186 14.0334 7.83066 14.046C7.78786 14.0571 7.74507 14.0619 7.70069 14.0619C7.6579 14.0619 7.61511 14.0571 7.57232 14.046C7.53111 14.0334 7.4899 14.0175 7.45187 13.9953L4.42313 12.2456C4.39618 12.2298 4.35656 12.206 4.33437 12.1917C4.30584 12.355 4.29158 12.5198 4.29158 12.6846C4.29158 12.8494 4.30743 13.0143 4.33596 13.1775C4.36449 13.3392 4.40886 13.4993 4.46433 13.6546C4.52139 13.8099 4.59113 13.9589 4.67354 14.1015V14.0983ZM3.87792 7.48932C3.6909 7.81423 3.57045 8.17241 3.52132 8.54328C3.47219 8.91415 3.49755 9.28977 3.59423 9.65271C3.6909 10.0141 3.85732 10.3516 4.08554 10.6496C4.31377 10.946 4.59747 11.1948 4.92078 11.3818L7.98122 13.1506C7.98439 13.1516 7.98809 13.1527 7.99232 13.1537H8.00341C8.00764 13.1537 8.01133 13.1527 8.0145 13.1506C8.01767 13.1495 8.02084 13.1479 8.02401 13.1458L9.30778 12.4041L5.6118 10.2708C5.57535 10.2486 5.54048 10.2217 5.50878 10.1916C5.47807 10.1608 5.45144 10.1261 5.42954 10.0886C5.40893 10.0505 5.3915 10.0109 5.3804 9.9681C5.36931 9.9269 5.36297 9.8841 5.36456 9.83973V6.24042C5.20924 6.29748 5.05867 6.36722 4.91603 6.44963C4.77339 6.53363 4.63867 6.62872 4.51188 6.73491C4.38667 6.8411 4.26939 6.95838 4.1632 7.08517C4.05702 7.21038 3.96351 7.34668 3.88109 7.48932H3.87792ZM14.3905 9.93641C14.4286 9.95859 14.4635 9.98395 14.4951 10.0157C14.5253 10.0458 14.5522 10.0806 14.5744 10.1187C14.595 10.1567 14.6124 10.1979 14.6235 10.2391C14.633 10.2819 14.6394 10.3247 14.6378 10.3691V13.9684C15.1465 13.7814 15.5903 13.4533 15.9184 13.0222C16.248 12.5911 16.4462 12.076 16.4921 11.5372C16.5381 10.9983 16.4303 10.4563 16.1799 9.97603C15.9295 9.4958 15.5475 9.09641 15.0784 8.82698L12.018 7.05823C12.0148 7.05718 12.0111 7.05612 12.0069 7.05506H11.9958C11.9926 7.05612 11.9889 7.05718 11.9847 7.05823C11.9815 7.05929 11.9783 7.06087 11.9752 7.06299L10.6977 7.80155L14.3937 9.93641H14.3905ZM15.6664 8.01868H15.6648V8.02026L15.6664 8.01868ZM15.6648 8.01709C15.7567 7.48457 15.6949 6.93619 15.4857 6.43695C15.2781 5.93771 14.931 5.5082 14.4872 5.19756C14.0435 4.88851 13.5204 4.711 12.98 4.68722C12.438 4.66504 11.9023 4.79658 11.4331 5.06602L8.37269 6.83318C8.36952 6.83529 8.36688 6.83793 8.36477 6.8411L8.35843 6.85061C8.35737 6.85378 8.35631 6.85748 8.35526 6.8617C8.3542 6.86487 8.35367 6.86857 8.35367 6.8728V8.34992L12.0497 6.21507C12.0877 6.19288 12.1289 6.17703 12.1701 6.16435C12.2129 6.15325 12.2557 6.1485 12.2985 6.1485C12.3429 6.1485 12.3857 6.15325 12.4284 6.16435C12.4697 6.17703 12.5093 6.19288 12.5473 6.21507L15.576 7.96479C15.603 7.98064 15.6426 8.00283 15.6648 8.01709ZM7.65632 6.38148C7.65632 6.33869 7.66266 6.2959 7.67375 6.2531C7.68485 6.2119 7.70069 6.17069 7.72288 6.13265C7.74507 6.0962 7.77043 6.06133 7.80213 6.02963C7.83224 5.99952 7.86711 5.97258 7.90515 5.95197L10.9339 4.20383C10.9624 4.1864 11.002 4.16421 11.0242 4.15311C10.609 3.80602 10.1018 3.58414 9.56453 3.51599C9.02725 3.44625 8.48205 3.53183 7.99232 3.76164C7.501 3.99145 7.08575 4.35757 6.79572 4.81402C6.50568 5.27205 6.35195 5.80141 6.35195 6.34344V9.87776C6.353 9.88199 6.35406 9.88569 6.35512 9.88886C6.35617 9.89203 6.35776 9.8952 6.35987 9.89837C6.36198 9.90154 6.36463 9.90471 6.3678 9.90788C6.36991 9.90999 6.37308 9.9121 6.37731 9.91422L7.65632 10.6528V6.38148ZM8.3505 11.0522L9.99721 12.0031L11.6439 11.0522V9.15188L9.9988 8.20094L8.35209 9.15188L8.3505 11.0522Z" fill="var(--bg-strong-950)"></path>
                  </svg>
                  <span className="truncate">{option.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsClick}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0"
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </Button>
        </div>
      </Button>
    </div>
  );
};

export default LlmSelector;
