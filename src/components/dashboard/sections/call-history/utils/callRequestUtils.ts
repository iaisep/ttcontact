
import { FilterOption } from '../types';

/**
 * Prepare request data for the call history API
 * @param currentPage Current page number
 * @param pageSize Number of items per page
 * @param searchQuery Search query string
 * @param filters Array of applied filters
 * @param dateRange Date range for filtering
 * @returns Request data object for API call
 */
export const prepareCallHistoryRequest = (
  currentPage: number,
  pageSize: number,
  searchQuery: string,
  filters: FilterOption[],
  dateRange: {start: Date | null, end: Date | null}
): Record<string, any> => {
  const requestData: Record<string, any> = {
    page: currentPage,
    page_size: pageSize
  };
  
  // Add date range if defined
  if (dateRange.start) {
    requestData.start_date = dateRange.start.toISOString();
  }
  if (dateRange.end) {
    requestData.end_date = dateRange.end.toISOString();
  }
  
  // Add filters if any
  if (filters.length > 0) {
    const filterData: Record<string, any> = {};
    filters.forEach(filter => {
      if (filter.value !== null && filter.value !== '') {
        filterData[`filter_${filter.field}`] = String(filter.value);
      }
    });
    requestData.filters = filterData;
  }

  // Add search query if exists
  if (searchQuery) {
    requestData.search = searchQuery;
  }

  return requestData;
};
