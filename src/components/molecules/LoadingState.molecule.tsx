/**
 * LoadingStateMolecule - A reusable component for displaying loading states
 * 
 * Usage examples:
 * 
 * // Basic loading state
 * <LoadingStateMolecule message="Loading residents..." />
 * 
 * // Large loading state for full page
 * <LoadingStateMolecule 
 *   message="Fetching resident data..." 
 *   size="lg" 
 * />
 * 
 * // Small loading state for components
 * <LoadingStateMolecule 
 *   message="Saving..." 
 *   size="sm" 
 * />
 * 
 * // Custom styling
 * <LoadingStateMolecule 
 *   message="Processing request..." 
 *   className="bg-white rounded-lg shadow-sm p-8"
 * />
 * 
 * // Inline loading (horizontal layout)
 * <LoadingStateMolecule 
 *   message="Saving changes..." 
 *   size="sm"
 *   inline
 * />
 */
import React from 'react';
import { SpinnerAtom } from '@/components/atoms/Spinner.atom';
import { TextAtom } from '@/components/atoms/Text.atom';

interface LoadingStateProps {
    message: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    inline?: boolean;
}

export const LoadingStateMolecule = ({
    message,
    size = 'md',
    className = '',
    inline = false
}: LoadingStateProps) => {
    const sizeClasses = {
        sm: {
            container: 'py-6',
            spacing: 'mt-2',
        },
        md: {
            container: 'py-8',
            spacing: 'mt-3',
        },
        lg: {
            container: 'py-12',
            spacing: 'mt-4',
        },
    };

    const classes = sizeClasses[size];

    if (inline) {
        return (
            <div className={`flex items-center justify-center space-x-2 ${className}`}>
                <SpinnerAtom size={size} />
                <TextAtom variant="body" color="muted">
                    {message}
                </TextAtom>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center text-center ${classes.container} ${className}`}>
            <SpinnerAtom size={size} />
            <TextAtom
                variant="body"
                color="muted"
                className={classes.spacing}
            >
                {message}
            </TextAtom>
        </div>
    );
};