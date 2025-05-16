
import { FilterOption } from "../types";

/**
 * Builds query parameters for GET requests
 */
export const buildQueryParams = (params: Record<string, any>): string => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      // Handle arrays and objects by stringifying them
      if (typeof value === 'object') {
        return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
  
  return queryParams ? `?${queryParams}` : '';
};

/**
 * Prepares the request data for fetching call history
 */
export const prepareCallHistoryRequest = (
  page: number,
  pageSize: number,
  searchQuery: string,
  filters: FilterOption[],
  dateRange: {from: Date | null, to: Date | null}
) => {
  // Create the base request object
  const request = {
    page,
    pageSize,
    search: searchQuery || "",
    filters: filters && filters.length > 0 ? filters.map(filter => ({
      field: filter.field,
      value: filter.value,
      operator: filter.operator
    })) : [],
    dateRange: {
      from: dateRange.from ? dateRange.from.toISOString() : null,
      to: dateRange.to ? dateRange.to.toISOString() : null
    }
  };

  return request;
};
