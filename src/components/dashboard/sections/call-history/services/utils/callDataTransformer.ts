
import { CallHistoryItem } from '../../types';
import { processTimestamp } from './dateUtils';

/**
 * Transform raw API call data into CallHistoryItem format
 * @param item Raw call data from API
 * @param agentMapping Mapping of agent IDs to names
 * @returns Formatted CallHistoryItem
 */
export const transformCallData = (item: any, agentMapping: Record<string, string>): CallHistoryItem => {
  // Get date from timestamp or use current date as fallback
  let dateInfo = { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() };
  
  if (item.start_timestamp) {
    console.log('Processing start_timestamp:', item.start_timestamp, typeof item.start_timestamp);
    dateInfo = processTimestamp(item.start_timestamp);
  }

  // Use agent mapping to get agent name if available
  const agentId = item.agentId || item.agent_id;
  const agentName = agentId && agentMapping[agentId] 
    ? agentMapping[agentId] 
    : (item.agentName || item.agent_name || 'Unknown');

  // Extract call summary data - log it to help with debugging
  const callSummary = item.call_analysis?.call_summary || item.call_summary || '';
  console.log('Call summary from API:', callSummary);

  return {
    id: item.id || item.callId || item.call_id || `call-${Math.random().toString(36).substring(2, 9)}`,
    callId: item.callId || item.call_id || `call-${Math.random().toString(36).substring(2, 9)}`,
    batchCallId: item.batchCallId || item.batch_call_id,
    agentName: agentName,
    agentId: agentId,
    phoneNumber: item.phoneNumber || item.phone_number || '',
    from: item.from || item.from_number || 'Unknown',
    to: item.to || item.to_number || 'Unknown',
    date: dateInfo.date,
    time: dateInfo.time,
    duration: item.duration || (item.duration_ms ? `${Math.floor(Number(item.duration_ms) / 1000)}s` : '0s'),
    type: item.type || item.call_type || 'unknown',
    cost: item.cost || '0.00',
    status: item.status || item.call_status || 'ended',
    disconnectionReason: item.disconnectionReason || item.disconnection_reason || '',
    userSentiment: item.userSentiment || item.user_sentiment || 'Unknown',
    callSuccessful: item.callSuccessful || item.call_successful || false,
    callSuccessfulStatus: item.callSuccessfulStatus || item.call_successful_status,
    endToEndLatency: item.endToEndLatency || item.end_to_end_latency,
    oportunidad: item.oportunidad || false,
    opportunidad: item.opportunidad || '',
    resumen_2da_llamada: item.resumen_2da_llamada || '',
    recording_url: item.recording_url || '',
    call_summary: callSummary,
    transcript: item.transcript || ''
  };
};
