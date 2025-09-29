import * as React from 'react';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';

export type CheckboxAtomProps = React.ComponentProps<typeof ShadcnCheckbox>;

export const CheckboxAtom = React.forwardRef<
  React.ElementRef<typeof ShadcnCheckbox>,
  CheckboxAtomProps
>((props, ref) => <ShadcnCheckbox ref={ref} {...props} />);

CheckboxAtom.displayName = 'CheckboxAtom';
