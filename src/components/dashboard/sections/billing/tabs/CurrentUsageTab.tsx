
import React from 'react';
import { UsageData } from '../types';
import UsageStatsCard from '../components/UsageStatsCard';
import CostBreakdownCard from '../components/CostBreakdownCard';
import PlanInfoCard from '../components/PlanInfoCard';
import AutoRechargeCard from '../components/AutoRechargeCard';

interface CurrentUsageTabProps {
  usage: UsageData | null;
}

const CurrentUsageTab = ({ usage }: CurrentUsageTabProps) => {
  return (
    <div className="space-y-4">
      <UsageStatsCard usage={usage} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CostBreakdownCard usage={usage} />
        <PlanInfoCard />
      </div>
      
      <AutoRechargeCard />
    </div>
  );
};

export default CurrentUsageTab;
