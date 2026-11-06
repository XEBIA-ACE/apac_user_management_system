import type { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { MessageVariant } from './FormValidationMessage';

export interface NotificationBannerProps {
  variant: MessageVariant;
  children: ReactNode;
}

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
} as const;

// Notification Banner stub (Success, Error, Warning, Info).
export function NotificationBanner({ variant, children }: NotificationBannerProps) {
  const Icon = ICONS[variant];
  const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';
  return (
    <div className={`ums-banner ums-banner--${variant}`} role={role}>
      <Icon aria-hidden="true" size={18} />
      <div>{children}</div>
    </div>
  );
}
