
import React from 'react';

interface EmptyStateProps {
  searchActive: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchActive }) => {
  return (
    <div className="text-center py-12 text-muted-foreground">
      {searchActive 
        ? "No voices match your search criteria. Try adjusting your filters." 
        : "No voices available for this provider."}
    </div>
  );
};

export default EmptyState;
