
import React from 'react';
import CallHistoryFilters from './components/CallHistoryFilters';
import CallHistoryHeader from './components/CallHistoryHeader';
import CallHistoryTable from './components/CallHistoryTable';
import CallDetailDrawer from './components/CallDetailDrawer';
import { useCallHistory } from './hooks';

/**
 * Main component for the Call History section
 */
const CallHistorySection = () => {
  const {
    isLoading,
    callHistory,
    searchQuery,
    setSearchQuery,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    dateRange,
    updateDateRange,
    columnVisibility,
    toggleColumnVisibility,
    updateColumnVisibility,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    selectedCall,
    fetchCallDetails,
    closeCallDetails,
    refreshData
  } = useCallHistory();

  // Log the call history data before rendering
  React.useEffect(() => {
    console.log('Call History Section rendering with data:', { 
      callHistoryLength: callHistory?.length,
      dateRange,
      filters,
      columnVisibility
    });
  }, [callHistory, dateRange, filters, columnVisibility]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <CallHistoryHeader refreshData={refreshData} />
      
      {/* Filters */}
      <CallHistoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        addFilter={addFilter}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
        dateRange={dateRange}
        updateDateRange={updateDateRange}
        columnVisibility={columnVisibility}
        toggleColumnVisibility={toggleColumnVisibility}
        updateColumnVisibility={updateColumnVisibility}
      />
      
      {/* Table */}
      <CallHistoryTable
        isLoading={isLoading}
        callHistory={callHistory}
        columnVisibility={columnVisibility}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onRowClick={fetchCallDetails}
      />
      
      {/* Call Detail Drawer */}
      {selectedCall && (
        <CallDetailDrawer
          call={selectedCall}
          onClose={closeCallDetails}
        />
      )}
    </div>
  );
};

export default CallHistorySection;
