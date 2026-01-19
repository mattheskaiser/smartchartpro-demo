import { ReactNode } from 'react';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';

interface AdminPageLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: keyof typeof import('lucide-react').icons;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
  };
  headerExtra?: ReactNode; // For custom elements like refresh button, timestamps, etc.
}

export function AdminPageLayoutTemplate({
  title,
  subtitle,
  children,
  actionButton,
  headerExtra,
}: AdminPageLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Exact Dashboard Header Layout */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>

        {/* Right side of header */}
        {(actionButton || headerExtra) && (
          <div className="flex items-center space-x-4">
            {headerExtra}
            {actionButton && (
              <ButtonAtom
                onClick={actionButton.onClick}
                variant={actionButton.variant || 'primary'}
                disabled={actionButton.disabled}
                className="inline-flex items-center"
              >
                {actionButton.icon && (
                  <DynamicIconAtom
                    name={actionButton.icon as keyof typeof import('lucide-react').icons}
                    size="sm"
                    className="mr-2"
                  />
                )}
                {actionButton.label}
              </ButtonAtom>
            )}
          </div>
        )}
      </div>

      {/* Content - NO WRAPPER, NO MARGINS, NO PADDING */}
      {/* All spacing and containers must be handled by individual content */}
      {children}
    </div>
  );
}
