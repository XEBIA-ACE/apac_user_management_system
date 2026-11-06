import type { ReactNode } from 'react';
import { FormCard } from './FormCard';

export interface ConfirmationDialogProps {
  heading: string;
  irreversibilityStatement: string;
  children?: ReactNode;
  actions: ReactNode;
}

// Confirmation Dialog / Deletion Confirmation Screen stub. Rendered as a
// full-page screen (not a modal overlay) inside the authenticated layout.
// TODO(OQ-06): The itemised list of data entities removed on deletion is TBD.
export function ConfirmationDialog({
  heading,
  irreversibilityStatement,
  children,
  actions,
}: ConfirmationDialogProps) {
  return (
    <FormCard heading={heading} wide>
      <p>
        <strong>{irreversibilityStatement}</strong>
      </p>
      {children}
      <div className="ums-actions">{actions}</div>
    </FormCard>
  );
}
