
import React from 'react';
import { Button } from '@/components/ui/button';

interface DialogFooterButtonsProps {
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isEditing: boolean;
}

const DialogFooterButtons: React.FC<DialogFooterButtonsProps> = ({
  onClose,
  onSubmit,
  isSubmitting,
  isEditing
}) => {
  return (
    <>
      <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
      </Button>
    </>
  );
};

export default DialogFooterButtons;
