import * as React from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';

export type InputAtomProps = React.ComponentProps<typeof ShadcnInput>;

export const InputAtom = React.forwardRef<HTMLInputElement, InputAtomProps>((props, ref) => (
  <ShadcnInput ref={ref} {...props} />
));

InputAtom.displayName = 'InputAtom';
