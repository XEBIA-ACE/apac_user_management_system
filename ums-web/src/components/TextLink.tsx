import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

// Link / Text Button stub. Use TextLink for navigation and TextButton for
// low-emphasis in-page actions (e.g. 'Resend OTP').
// TODO(OQ-01): Resend OTP max attempts and cooldown period are TBD; the
// rate-limited Disabled state with countdown label depends on that decision.
export function TextLink({ className, ...rest }: LinkProps) {
  return <Link className={['ums-link', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface TextButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  isDisabled?: boolean;
}

export function TextButton({ isDisabled = false, onClick, className, ...rest }: TextButtonProps) {
  return (
    <button
      type="button"
      className={['ums-link', className].filter(Boolean).join(' ')}
      aria-disabled={isDisabled ? 'true' : undefined}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    />
  );
}
