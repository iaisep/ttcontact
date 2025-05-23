
import { AnalyticsData, Agent } from '../types';

/**
 * Provides mock analytics data for fallback scenarios
 */
export const getMockAnalyticsData = (): AnalyticsData => {
  return {
    overview: {
      total_calls: 456,
      total_minutes: 4328,
      avg_call_duration: 9.5,
      successful_calls: 432,
      failed_calls: 24,
      success_rate: 94.7,
      inbound_calls: 215,
      outbound_calls: 241,
    },
    daily_calls: [
      { date: '05/01', calls: 35, minutes: 315 },
      { date: '05/02', calls: 42, minutes: 378 },
      { date: '05/03', calls: 58, minutes: 551 },
      { date: '05/04', calls: 75, minutes: 712 },
      { date: '05/05', calls: 81, minutes: 769 },
      { date: '05/06', calls: 92, minutes: 874 },
      { date: '05/07', calls: 73, minutes: 729 },
    ],
    call_duration: [
      { range: '0-1 min', count: 24 },
      { range: '1-3 min', count: 86 },
      { range: '3-5 min', count: 124 },
      { range: '5-10 min', count: 156 },
      { range: '10+ min', count: 66 },
    ],
    agent_performance: [
      { agent_id: 'agent_1', agent_name: 'Sales Agent', calls: 175, avg_duration: 8.2, success_rate: 96.0 },
      { agent_id: 'agent_2', agent_name: 'Support Agent', calls: 142, avg_duration: 11.5, success_rate: 92.3 },
      { agent_id: 'agent_3', agent_name: 'Appointment Scheduler', calls: 139, avg_duration: 8.9, success_rate: 95.7 },
    ],
    call_breakdown: [
      { name: 'Inbound', value: 215 },
      { name: 'Outbound', value: 241 },
    ],
    call_status: [
      { name: 'Successful', value: 432 },
      { name: 'Failed', value: 24 },
    ],
    busiest_hours: [
      { hour: '9AM', calls: 45 },
      { hour: '10AM', calls: 52 },
      { hour: '11AM', calls: 49 },
      { hour: '12PM', calls: 38 },
      { hour: '1PM', calls: 41 },
      { hour: '2PM', calls: 54 },
      { hour: '3PM', calls: 62 },
      { hour: '4PM', calls: 57 },
      { hour: '5PM', calls: 43 },
      { hour: '6PM', calls: 15 },
    ],
  };
};

/**
 * Creates mock agents data from analytics agent performance
 */
export const getMockAgentsData = (agentPerformance: any[]): Agent[] => {
  return agentPerformance.map(a => ({
    id: a.agent_id,
    name: a.agent_name,
    agent_id: a.agent_id,
    agent_name: a.agent_name,
    agent_type: 'unknown',
    voice_id: '',
    last_modification_timestamp: Date.now(),
    updated_at: new Date().toISOString()
  }));
};
