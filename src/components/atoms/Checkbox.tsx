import * as React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";

export type CheckboxProps = React.ComponentProps<typeof ShadcnCheckbox>;

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof ShadcnCheckbox>,
  CheckboxProps
>((props, ref) => <ShadcnCheckbox ref={ref} {...props} />);

Checkbox.displayName = "Checkbox"; 