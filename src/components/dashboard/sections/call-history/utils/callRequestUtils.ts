
import { FilterOption } from "../types";

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
    filters: [],
    dateRange: {
      from: dateRange.from ? dateRange.from.toISOString() : null,
      to: dateRange.to ? dateRange.to.toISOString() : null
    }
  };

  // Add any applied filters
  if (filters && filters.length > 0) {
    // @ts-ignore - This is fine, we're building the request object
    request.filters = filters.map(filter => ({
      field: filter.field,
      value: filter.value,
      operator: filter.operator
    }));
  }

  return request;
};
