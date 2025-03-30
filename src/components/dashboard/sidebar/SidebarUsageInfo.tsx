
import { Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarUsageInfoProps {
  sidebarCollapsed: boolean;
}

const SidebarUsageInfo = ({ sidebarCollapsed }: SidebarUsageInfoProps) => {
  const { t } = useLanguage();
  
  if (sidebarCollapsed) {
    return (
      <button className="w-full flex justify-center py-2.5">
        <div className="rounded-full w-5 h-5 flex items-center justify-center border border-gray-500">
          <span className="text-[8px]">i</span>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-lg bg-gray-50 p-3 mb-3">
      <h3 className="font-medium text-sm mb-2">{t('organization_usage')}</h3>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{t('credits')}:</span>
        <span>$0.00 {t('remaining')}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{t('agents')}:</span>
        <span>1/1 {t('available')}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
        <div className="bg-red-500 h-1.5 rounded-full w-full"></div>
      </div>
      <div className="flex items-center text-xs text-gray-500">
        <div className="w-4 h-4 mr-1 flex items-center justify-center">
          <div className="rounded-full w-3 h-3 flex items-center justify-center border border-gray-500">
            <span className="text-[8px]">i</span>
          </div>
        </div>
        <span>{t('campaigns')}:</span>
        <span className="ml-auto">0/1 {t('available')}</span>
      </div>
    </div>
  );
};

export default SidebarUsageInfo;
