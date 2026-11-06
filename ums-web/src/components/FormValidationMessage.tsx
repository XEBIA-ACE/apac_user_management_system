import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export type MessageVariant = 'error' | 'success' | 'warning' | 'info';

export interface FormValidationMessageProps {
  id: string;
  variant: MessageVariant;
  message: string;
}

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
} as const;

// Form Validation Message stub. Associate with its input via aria-describedby={id}.
export function FormValidationMessage({ id, variant, message }: FormValidationMessageProps) {
  const Icon = ICONS[variant];
  return (
    <span
      id={id}
      className={`ums-validation ums-validation--${variant}`}
      role={variant === 'error' ? 'alert' : undefined}
      aria-live={variant === 'error' ? undefined : 'polite'}
    >
      <Icon aria-hidden="true" size={14} />
      <span>{message}</span>
    </span>
  );
}
