
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface FooterButtonsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

const FooterButtons = ({ onClose, onSubmit, isSubmitting, isEditMode }: FooterButtonsProps) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
      </Button>
    </DialogFooter>
  );
};

export default FooterButtons;
