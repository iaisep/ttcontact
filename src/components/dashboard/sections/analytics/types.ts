
export interface AnalyticsOverview {
  total_calls: number;
  total_minutes: number;
  avg_call_duration: number;
  successful_calls: number;
  failed_calls: number;
  success_rate: number;
  inbound_calls?: number;
  outbound_calls?: number;
}

export interface DailyCallVolume {
  date: string;
  calls: number;
  minutes: number;
}

export interface CallDuration {
  range: string;
  count: number;
}

export interface CallDirection {
  direction: string;
  count: number;
  percentage: number;
}

export interface CallStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface AgentPerformance {
  agent_id: string;
  agent_name: string;
  calls: number;
  avg_duration: number;
  success_rate: number;
}

export interface BusiestHour {
  hour: string;
  calls: number;
}

export interface CallCounts {
  total: number;
  change: string;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  daily_calls: DailyCallVolume[];
  call_duration: CallDuration[];
  agent_performance: AgentPerformance[];
  call_breakdown: { name: string; value: number }[];
  call_status: { name: string; value: number }[];
  busiest_hours: BusiestHour[];
}
