'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const ModalOrganism = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('w-full max-w-lg h-[450px] flex flex-col bg-white', className)}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 py-4">{children}</div>

        {footer && <DialogFooter className="flex-shrink-0">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

// Convenience component for form modals with standard Cancel/Submit buttons
interface FormModalProps extends Omit<ModalProps, 'footer'> {
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  submitVariant?: 'primary' | 'secondary' | 'destructive';
}

export const FormModalOrganism = ({
  onSubmit,
  onClose,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  submitVariant = 'primary',
  children,
  ...modalProps
}: FormModalProps) => {
  const footer = (
    <>
      <ButtonAtom variant="secondary" onClick={onClose} disabled={isSubmitting}>
        {cancelLabel}
      </ButtonAtom>
      <ButtonAtom
        variant={submitVariant}
        type="submit"
        form="modal-form"
        isLoading={isSubmitting}
        loadingText="Submitting..."
      >
        {submitLabel}
      </ButtonAtom>
    </>
  );

  return (
    <ModalOrganism {...modalProps} onClose={onClose} footer={footer}>
      <form id="modal-form" onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </ModalOrganism>
  );
};
