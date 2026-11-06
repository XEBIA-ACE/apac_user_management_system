import type { ButtonHTMLAttributes, MouseEvent } from 'react';

type Variant = 'primary' | 'secondary' | 'destructive';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  isDisabled?: boolean;
  isLoading?: boolean;
}

// Disabled state is conveyed with aria-disabled="true" (not the HTML disabled
// attribute) so the control stays focusable and announced by assistive tech.
function BaseButton({
  variant,
  isDisabled = false,
  isLoading = false,
  onClick,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps & { variant: Variant }) {
  const inactive = isDisabled || isLoading;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (inactive) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={['ums-button', `ums-button--${variant}`, className].filter(Boolean).join(' ')}
      aria-disabled={inactive ? 'true' : undefined}
      aria-busy={isLoading ? 'true' : undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}

// Primary Button stub (Default, Hover, Focus, Active, Loading, Disabled).
export function PrimaryButton(props: ButtonProps) {
  return <BaseButton variant="primary" {...props} />;
}

// Secondary Button stub (Default, Hover, Focus, Active, Disabled).
export function SecondaryButton(props: Omit<ButtonProps, 'isLoading'>) {
  return <BaseButton variant="secondary" {...props} />;
}

// Destructive Button stub — use ONLY for the confirmed deletion action on SCR-006.
export function DestructiveButton(props: ButtonProps) {
  return <BaseButton variant="destructive" {...props} />;
}
