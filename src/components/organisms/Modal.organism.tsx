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
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const ModalOrganism = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  className,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>

        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
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
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : submitLabel}
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