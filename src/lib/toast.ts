import { toast as sonnerToast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
}

export const toast = ({ title, description, type = 'success', duration = 3000 }: ToastOptions) => {
    const toastFn = {
        success: sonnerToast.success,
        error: sonnerToast.error,
        info: sonnerToast.info,
        warning: sonnerToast.warning,
    }[type];

    return toastFn(title, {
        description,
        duration,
    });
};
