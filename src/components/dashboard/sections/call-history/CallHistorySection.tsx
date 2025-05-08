
import React from 'react';
import { useCallHistory } from './hooks';
import {
  CallHistoryHeader,
  CallHistoryFilters,
  CallHistoryTable,
  CallDetailDrawer
} from './components';

const CallHistorySection: React.FC = () => {
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
    closeCallDetails
  } = useCallHistory();

  // Function to handle exports
  const handleExport = () => {
    // In a real application, this would trigger a download of the filtered call history data
    console.log('Exporting data:', { callHistory, filters, dateRange });
    // For now, just show a success message
    alert('Export started. You will receive a notification when it is ready.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <CallHistoryHeader onExport={handleExport} />

      {/* Filters Bar */}
      <CallHistoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        addFilter={addFilter}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
        dateRange={{
          from: dateRange.start as Date, 
          to: dateRange.end as Date
        }}
        updateDateRange={(range) => {
          updateDateRange(range.from, range.to);
        }}
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

      {/* Call Details Drawer */}
      {selectedCall && (
        <CallDetailDrawer call={selectedCall} onClose={closeCallDetails} />
      )}
    </div>
  );
};

export default CallHistorySection;
